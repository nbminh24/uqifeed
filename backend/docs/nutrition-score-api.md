# Nutrition Score API Documentation

This document outlines the API endpoints for the nutrition score feature in the UQIFeed application.

## Overview

The nutrition score feature evaluates foods based on their nutritional content compared to the user's target nutrition. The score calculation takes into account deviations from target values for calories, protein, fat, carbs, and fiber with specific weightings.

## Score Calculation

The nutrition score is calculated using the following formula:

1. Calculate the percentage of each nutrient compared to the target:
   - Calories percentage = (food calories / target calories) * 100
   - Protein percentage = (food protein / target protein) * 100
   - Fat percentage = (food fat / target fat) * 100
   - Carbs percentage = (food carbs / target carbs) * 100
   - Fiber percentage = (food fiber / target fiber) * 100

2. Calculate the absolute deviation from 100% for each nutrient:
   - Calorie deviation = |calories percentage - 100|
   - Protein deviation = |protein percentage - 100|
   - Fat deviation = |fat percentage - 100|
   - Carbs deviation = |carbs percentage - 100|
   - Fiber deviation = |fiber percentage - 100|

3. Apply weights to each deviation:
   - Weighted deviation = (calorie deviation * 0.3) + (protein deviation * 0.2) + (fat deviation * 0.15) + (carbs deviation * 0.15) + (fiber deviation * 0.2)

4. Convert to score (0-100):
   - Score = 100 - (weighted deviation / 2)

## Score Interpretation

The score is interpreted as follows:

- 80-100: Excellent - This food aligns very well with your nutritional needs.
- 60-79: Good - This food matches your nutritional needs fairly well.
- 40-59: Moderate - This food somewhat matches your nutritional needs, but there is room for improvement.
- 20-39: Poor - This food does not match your nutritional needs well.
- 0-19: Very Poor - This food does not align with your nutritional needs at all.

## API Endpoints

### Calculate and Save Nutrition Score

Calculate a nutrition score for a food and save it to the database.

- **URL**: `/api/nutrition/score/:foodId`
- **Method**: `POST`
- **Authentication**: Required
- **URL Parameters**:
  - `foodId`: ID of the food to calculate score for

**Success Response**:
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Nutrition score calculated and saved successfully",
    "data": {
      "score": {
        "id": "score_id",
        "nutrition_score": 85,
        "food_id": "food_id",
        "target_nutrition_id": "target_nutrition_id",
        "interpretation": {
          "rating": "Excellent",
          "description": "This food aligns very well with your nutritional needs"
        },
        "comparisons": {
          "calories": {
            "food": 500,
            "target": 2500,
            "percentage": 20,
            "deviation": 80
          },
          "protein": {
            "food": 30,
            "target": 150,
            "percentage": 20,
            "deviation": 80
          },
          "fat": {
            "food": 20,
            "target": 80,
            "percentage": 25,
            "deviation": 75
          },
          "carbs": {
            "food": 50,
            "target": 300,
            "percentage": 16.67,
            "deviation": 83.33
          },
          "fiber": {
            "food": 5,
            "target": 30,
            "percentage": 16.67,
            "deviation": 83.33
          }
        }
      },
      "food": {
        "id": "food_id",
        "name": "Food Name"
      }
    }
  }
  ```

**Error Responses**:
- **Code**: 404 Not Found
  - Food not found
  - Target nutrition not found
- **Code**: 400 Bad Request
  - Food does not have nutrition values
- **Code**: 500 Internal Server Error
  - Error calculating nutrition score

### Get Nutrition Score for a Food

Retrieve a nutrition score for a specific food.

- **URL**: `/api/nutrition/score/:foodId`
- **Method**: `GET`
- **Authentication**: Required
- **URL Parameters**:
  - `foodId`: ID of the food to get score for

**Success Response**:
- **Code**: 200 OK
- **Content**: Same as the success response for the POST endpoint

**Error Responses**:
- **Code**: 404 Not Found
  - Food not found
  - Nutrition score not found for this food
- **Code**: 500 Internal Server Error
  - Error getting nutrition score

### Get All Nutrition Scores

Retrieve all nutrition scores for the authenticated user.

- **URL**: `/api/nutrition/scores`
- **Method**: `GET`
- **Authentication**: Required

**Success Response**:
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Nutrition scores retrieved successfully",
    "data": {
      "scores": [
        {
          "id": "score_id_1",
          "nutrition_score": 85,
          "food_id": "food_id_1",
          "target_nutrition_id": "target_nutrition_id",
          "interpretation": {
            "rating": "Excellent",
            "description": "This food aligns very well with your nutritional needs"
          },
          "comparisons": {
            "calories": { ... },
            "protein": { ... },
            "fat": { ... },
            "carbs": { ... },
            "fiber": { ... }
          },
          "food": {
            "id": "food_id_1",
            "name": "Food Name 1"
          }
        },
        {
          "id": "score_id_2",
          "nutrition_score": 60,
          "food_id": "food_id_2",
          "target_nutrition_id": "target_nutrition_id",
          "interpretation": {
            "rating": "Good",
            "description": "This food matches your nutritional needs fairly well"
          },
          "comparisons": { ... },
          "food": {
            "id": "food_id_2",
            "name": "Food Name 2"
          }
        }
      ]
    }
  }
  ```

**Error Responses**:
- **Code**: 404 Not Found
  - Target nutrition not found
- **Code**: 500 Internal Server Error
  - Error getting nutrition scores

### Delete a Nutrition Score

Delete a nutrition score.

- **URL**: `/api/nutrition/score/:scoreId`
- **Method**: `DELETE`
- **Authentication**: Required
- **URL Parameters**:
  - `scoreId`: ID of the score to delete

**Success Response**:
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Nutrition score deleted successfully"
  }
  ```

**Error Responses**:
- **Code**: 404 Not Found
  - Nutrition score not found
- **Code**: 403 Forbidden
  - Not authorized to delete this score
- **Code**: 500 Internal Server Error
  - Error deleting nutrition score

## Database Schema

The nutrition scores are stored in the `nutrition_scores` collection in Firebase with the following structure:

```javascript
{
  id: string,                // Auto-generated by Firebase
  nutrition_score: number,   // 0-100 score
  food_id: string,           // Reference to food document
  target_nutrition_id: string, // Reference to target nutrition document
  interpretation: {
    rating: string,          // Excellent, Good, Moderate, Poor, or Very Poor
    description: string      // Description of the rating
  },
  comparisons: {
    calories: {
      food: number,          // Calories in food
      target: number,        // Target calories
      percentage: number,    // Percentage of target
      deviation: number      // Deviation from target
    },
    protein: { ... },        // Same structure as calories
    fat: { ... },            // Same structure as calories
    carbs: { ... },          // Same structure as calories
    fiber: { ... }           // Same structure as calories
  }
}
```

## Integration Example

Here's an example of how to calculate and save a nutrition score for a food:

```javascript
// Calculate and save nutrition score for a food
async function calculateAndSaveNutritionScore(foodId) {
  try {
    const response = await fetch(`/api/nutrition/score/${foodId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Nutrition score:', data.data.score.nutrition_score);
      console.log('Rating:', data.data.score.interpretation.rating);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error calculating nutrition score:', error);
    throw error;
  }
}
```
