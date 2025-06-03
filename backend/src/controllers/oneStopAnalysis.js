/**
 * One Stop Analysis Controller
 * Handles the comprehensive analysis flow from image to nutritional insights
 */

const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const ImageProcessingService = require('../services/uploadService');
const Food = require('../models/food');
const Ingredient = require('../models/ingredient');
const NutritionScore = require('../models/nutritionScore');
const NutritionComment = require('../models/nutritionComment');
const TargetNutrition = require('../models/targetNutrition');
const NutritionScoreCalculator = require('../services/nutritionScoreCalculator');
const NutritionCommentService = require('../services/nutritionCommentService');
const { calculateCalories } = require('../utils/nutritionCalculator');

const OneStopAnalysisController = {
    /**
     * Process image, analyze food, save to database, calculate nutrition,
     * generate score and comments, and return comprehensive results
     * @route POST /api/one-stop-analysis
     * @access Private
     */    processFullAnalysis: async (req, res) => {
        try {
            console.log("Request body:", req.body);
            console.log("Content-Type:", req.headers['content-type']);

            if (!req.body) {
                return sendErrorResponse(
                    res,
                    'Request body is undefined',
                    400
                );
            } const { meal_type_id } = req.body;
            const file = req.file;  // Multer adds the file object

            // Validate required fields
            if (!file && !req.body.base64Image) {
                return sendErrorResponse(
                    res,
                    'Image is required (either as file upload or base64)',
                    400
                );
            }

            if (!meal_type_id) {
                return sendErrorResponse(
                    res,
                    'Meal type ID is required',
                    400
                );
            }            // Step 1: Process the image, upload to Cloudinary, and extract food data
            let processingResults;
            try {
                if (file) {
                    processingResults = await ImageProcessingService.processUploadedImage(file, req.user.id);
                } else {
                    processingResults = await ImageProcessingService.processImage(req.body.base64Image, req.user.id);
                }

                if (!processingResults.cloudinaryInfo?.url) {
                    throw new Error('Failed to upload image to Cloudinary');
                }
            } catch (error) {
                console.error('Image processing error:', error);
                return sendErrorResponse(
                    res,
                    'Failed to process and upload image',
                    500
                );
            }

            if (!processingResults || !processingResults.foodData) {
                return sendErrorResponse(
                    res,
                    'Failed to analyze food image',
                    500
                );
            } const foodData = processingResults.foodData;

            // Step 2: Save food to database
            // Only use cloudinaryInfo URL since base64 is already uploaded to Cloudinary
            const foodImageUrl = processingResults.cloudinaryInfo?.url;
            const cloudinaryPublicId = processingResults.cloudinaryInfo?.publicId;

            // Validate we have a valid URL before saving
            if (!foodImageUrl) {
                return sendErrorResponse(
                    res,
                    'Failed to get valid image URL from Cloudinary',
                    500
                );
            }

            // Create food record with Cloudinary URL
            const food = {
                user_id: req.user.id,
                meal_type_id,
                food_image: foodImageUrl, // Using secure_url from Cloudinary
                cloudinary_public_id: cloudinaryPublicId,
                food_name: foodData.foodName,
                food_description: foodData.foodDescription,
                food_advice: foodData.foodAdvice,
                food_preparation: foodData.foodPreparation,
                // Initialize nutrition values as 0
                total_protein: 0,
                total_carb: 0,
                total_fat: 0,
                total_fiber: 0,
                total_calorie: 0
            };

            const savedFood = await Food.save(food);

            // Step 3: Extract and save ingredients
            const ingredients = [];
            if (Array.isArray(foodData.foodIngredientList)) {
                for (const item of foodData.foodIngredientList) {
                    // Extract numeric values and remove non-numeric characters
                    const extractNumber = (value) => {
                        if (!value) return null;
                        // If the value is already a number, return it
                        if (typeof value === 'number') return value;
                        // If string contains non-numeric chars besides dots and commas, use amount parser
                        if (value.toString().match(/[^0-9.,]/)) {
                            const { value: parsedValue } = require('../utils/nutritionCalculator').parseAmount(value);
                            return parsedValue;
                        }
                        // Otherwise extract simple number
                        const matches = value.toString().match(/(\d+(\.\d+)?)/);
                        return matches ? parseFloat(matches[0]) : null;
                    };

                    const ingredient = {
                        food_id: savedFood.id,
                        ingredient_name: item['Ingredient Name'] || '',
                        ingredient_amount: extractNumber(item['Ingredient Amount']),
                        ingredient_description: item['Ingredient Description'] || {},
                        ingredient_protein: extractNumber(item['Ingredient Protein']),
                        ingredient_carb: extractNumber(item['Ingredient Carb']),
                        ingredient_fat: extractNumber(item['Ingredient Fat']),
                        ingredient_fiber: extractNumber(item['Ingredient Fiber'])
                    };
                    ingredients.push(ingredient);
                }
            }

            // Save ingredients
            const savedIngredients = ingredients.length > 0 ?
                await Ingredient.saveMany(ingredients) : [];

            // Step 4: Calculate total nutrition values from ingredients
            let totalProtein = 0;
            let totalCarb = 0;
            let totalFat = 0;
            let totalFiber = 0;
            let totalCalorie = 0;

            savedIngredients.forEach(ingredient => {
                if (ingredient.ingredient_protein) totalProtein += ingredient.ingredient_protein;
                if (ingredient.ingredient_carb) totalCarb += ingredient.ingredient_carb;
                if (ingredient.ingredient_fat) totalFat += ingredient.ingredient_fat;
                if (ingredient.ingredient_fiber) totalFiber += ingredient.ingredient_fiber;
            });

            // Calculate calories using the utility function (already rounds to whole number)
            totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);

            // Update food with calculated nutrition values
            const updatedFood = await Food.update(savedFood.id, {
                total_protein: totalProtein,
                total_carb: totalCarb,
                total_fat: totalFat,
                total_fiber: totalFiber,
                total_calorie: totalCalorie
            });

            // Step 5: Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);

            if (!targetNutrition) {
                // Return success without score if no target nutrition
                return sendSuccessResponse(
                    res,
                    'Food analyzed and saved successfully, but no nutrition score calculated (no target nutrition)',
                    {
                        food: updatedFood,
                        ingredients: savedIngredients
                    }
                );
            }

            // Step 6: Calculate nutrition score
            const score = NutritionScoreCalculator.calculateScore(updatedFood, targetNutrition);
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
            const comparisons = NutritionScoreCalculator.getNutritionComparisons(updatedFood, targetNutrition);

            // Save nutrition score
            const scoreData = {
                nutrition_score: score,
                food_id: updatedFood.id,
                target_nutrition_id: targetNutrition.id,
                interpretation: interpretation,
                comparisons: comparisons
            };

            const savedScore = await NutritionScore.save(scoreData);

            // Step 7: Generate nutrition comments
            const comments = NutritionCommentService.generateAllComments(
                updatedFood,
                targetNutrition,
                meal_type_id
            );

            // Save comments to database
            const savedComments = {};
            for (const nutrientType in comments) {
                const comment = comments[nutrientType];
                const nutritionType = nutrientType; // using the key directly

                const commentData = {
                    food_id: updatedFood.id,
                    target_nutrition_id: targetNutrition.id,
                    nutrition_type: nutritionType,
                    nutrition_delta: comment.percentage,
                    nutrition_comment: comment.comment,
                    icon: comment.icon,
                    meal_type: meal_type_id
                };

                // Fix: Use instance method save() after creating an instance of NutritionComment
                const nutritionComment = new NutritionComment(commentData);
                savedComments[nutrientType] = await nutritionComment.save();
            }

            // Step 8: Return comprehensive results
            return sendSuccessResponse(
                res,
                'Complete food analysis successful',
                {
                    food: updatedFood,
                    ingredients: savedIngredients,
                    nutritionScore: {
                        score: savedScore.nutrition_score,
                        interpretation: savedScore.interpretation
                    },
                    nutritionComments: savedComments
                }
            );

        } catch (error) {
            console.error('Error in one-stop analysis:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error processing complete food analysis',
                500
            );
        }
    },

    /**
     * Process uploaded image file, analyze food, save to database, calculate nutrition,
     * generate score and comments, and return comprehensive results
     * @route POST /api/one-stop-analysis/upload
     * @access Private
     */
    processFullAnalysisFromUpload: async (req, res) => {
        try {
            const { meal_type_id } = req.body;
            const file = req.file;

            // Validate required fields
            if (!file) {
                return sendErrorResponse(
                    res,
                    'Image file is required',
                    400
                );
            }

            if (!meal_type_id) {
                return sendErrorResponse(
                    res,
                    'Meal type ID is required',
                    400
                );
            }            // Step 1: Process the uploaded image and extract food data
            const processingResults = await ImageProcessingService.processUploadedImage(file, req.user.id);

            if (!processingResults || !processingResults.foodData) {
                return sendErrorResponse(
                    res,
                    'Failed to analyze food image',
                    500
                );
            } const foodData = processingResults.foodData;            // Step 2: Get Cloudinary info for saving to database
            if (!processingResults.cloudinaryInfo?.url) {
                console.error('Missing Cloudinary URL:', processingResults);
                return sendErrorResponse(
                    res,
                    'Failed to get image URL from Cloudinary',
                    500
                );
            }

            const foodImageUrl = processingResults.cloudinaryInfo.url;
            const cloudinaryPublicId = processingResults.cloudinaryInfo.publicId;

            // Extra validation to ensure URL exists and is a string
            if (typeof foodImageUrl !== 'string' || !foodImageUrl.startsWith('http')) {
                console.error('Invalid Cloudinary URL:', foodImageUrl);
                return sendErrorResponse(
                    res,
                    'Invalid image URL received from Cloudinary',
                    500
                );
            }

            const food = {
                user_id: req.user.id,
                meal_type_id: meal_type_id,
                food_image: foodImageUrl, // Validated Cloudinary URL
                cloudinary_public_id: cloudinaryPublicId || null, // Ensure null if undefined
                food_name: foodData.foodName || '',
                food_description: foodData.foodDescription || {},
                food_advice: foodData.foodAdvice || '',
                food_preparation: foodData.foodPreparation || '',
                // Initialize nutrition values as 0
                total_protein: 0,
                total_carb: 0,
                total_fat: 0,
                total_fiber: 0,
                total_calorie: 0
            };

            const savedFood = await Food.save(food);

            // Step 3: Extract and save ingredients
            const ingredients = [];
            if (Array.isArray(foodData.foodIngredientList)) {
                for (const item of foodData.foodIngredientList) {
                    // Extract numeric values and remove non-numeric characters
                    const extractNumber = (value) => {
                        if (!value) return null;
                        // If the value is already a number, return it
                        if (typeof value === 'number') return value;
                        // If string contains non-numeric chars besides dots and commas, use amount parser
                        if (value.toString().match(/[^0-9.,]/)) {
                            const { value: parsedValue } = require('../utils/nutritionCalculator').parseAmount(value);
                            return parsedValue;
                        }
                        // Otherwise extract simple number
                        const matches = value.toString().match(/(\d+(\.\d+)?)/);
                        return matches ? parseFloat(matches[0]) : null;
                    };

                    const ingredient = {
                        food_id: savedFood.id,
                        ingredient_name: item['Ingredient Name'] || '',
                        ingredient_amount: extractNumber(item['Ingredient Amount']),
                        ingredient_description: item['Ingredient Description'] || {},
                        ingredient_protein: extractNumber(item['Ingredient Protein']),
                        ingredient_carb: extractNumber(item['Ingredient Carb']),
                        ingredient_fat: extractNumber(item['Ingredient Fat']),
                        ingredient_fiber: extractNumber(item['Ingredient Fiber'])
                    };
                    ingredients.push(ingredient);
                }
            }

            // Save ingredients
            const savedIngredients = ingredients.length > 0 ?
                await Ingredient.saveMany(ingredients) : [];

            // Step 4: Calculate total nutrition values from ingredients
            let totalProtein = 0;
            let totalCarb = 0;
            let totalFat = 0;
            let totalFiber = 0;
            let totalCalorie = 0;

            savedIngredients.forEach(ingredient => {
                if (ingredient.ingredient_protein) totalProtein += ingredient.ingredient_protein;
                if (ingredient.ingredient_carb) totalCarb += ingredient.ingredient_carb;
                if (ingredient.ingredient_fat) totalFat += ingredient.ingredient_fat;
                if (ingredient.ingredient_fiber) totalFiber += ingredient.ingredient_fiber;
            });

            // Calculate calories using the utility function (already rounds to whole number)
            totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);

            // Update food with calculated nutrition values
            const updatedFood = await Food.update(savedFood.id, {
                total_protein: totalProtein,
                total_carb: totalCarb,
                total_fat: totalFat,
                total_fiber: totalFiber,
                total_calorie: totalCalorie
            });

            // Step 5: Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);

            if (!targetNutrition) {
                // Return success without score if no target nutrition
                return sendSuccessResponse(
                    res,
                    'Food analyzed and saved successfully, but no nutrition score calculated (no target nutrition)',
                    {
                        food: updatedFood,
                        ingredients: savedIngredients,
                        originalFilename: file.originalname
                    }
                );
            }

            // Step 6: Calculate nutrition score
            const score = NutritionScoreCalculator.calculateScore(updatedFood, targetNutrition);
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
            const comparisons = NutritionScoreCalculator.getNutritionComparisons(updatedFood, targetNutrition);

            // Save nutrition score
            const scoreData = {
                nutrition_score: score,
                food_id: updatedFood.id,
                target_nutrition_id: targetNutrition.id,
                interpretation: interpretation,
                comparisons: comparisons
            };

            const savedScore = await NutritionScore.save(scoreData);

            // Step 7: Generate nutrition comments
            const comments = NutritionCommentService.generateAllComments(
                updatedFood,
                targetNutrition,
                meal_type_id
            );

            // Save comments to database
            const savedComments = {};
            for (const nutrientType in comments) {
                const comment = comments[nutrientType];
                const nutritionType = nutrientType; // using the key directly

                const commentData = {
                    food_id: updatedFood.id,
                    target_nutrition_id: targetNutrition.id,
                    nutrition_type: nutritionType,
                    nutrition_delta: comment.percentage,
                    nutrition_comment: comment.comment,
                    icon: comment.icon,
                    meal_type: meal_type_id
                };

                // Fix: Use instance method save() after creating an instance of NutritionComment
                const nutritionComment = new NutritionComment(commentData);
                savedComments[nutrientType] = await nutritionComment.save();
            }

            // Step 8: Return comprehensive results
            return sendSuccessResponse(
                res,
                'Complete food analysis successful',
                {
                    food: updatedFood,
                    ingredients: savedIngredients,
                    originalFilename: file.originalname,
                    nutritionScore: {
                        score: savedScore.nutrition_score,
                        interpretation: savedScore.interpretation
                    },
                    nutritionComments: savedComments
                }
            );

        } catch (error) {
            console.error('Error in one-stop analysis from upload:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error processing complete food analysis',
                500
            );
        }
    }
};

module.exports = OneStopAnalysisController;
