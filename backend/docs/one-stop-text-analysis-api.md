# One-Stop Text Analysis API Documentation

## Overview

The One-Stop Text Analysis API provides a comprehensive workflow for food nutrition analysis from a text description in a single API endpoint. It integrates text-based food recognition, nutrition calculation, and personalized feedback in one request.

## Endpoint

```
POST /api/one-stop-text-analysis
```

## Authentication

This endpoint requires authentication. Include a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Request Body

| Parameter       | Type   | Required | Description                                 |
|-----------------|--------|----------|---------------------------------------------|
| textDescription | String | Yes      | Text description of the food                |
| meal_type_id    | Number | Yes      | ID of the meal type (breakfast, lunch, etc.)|

### Example Request

```json
{
  "textDescription": "I had 200g of grilled chicken breast with a side of steamed broccoli and 150g of brown rice",
  "meal_type_id": 1
}
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Complete food text analysis successful",
  "data": {
    "food": {
      "id": 123,
      "user_id": 456,
      "meal_type_id": 1,
      "food_text_description": "I had 200g of grilled chicken breast with a side of steamed broccoli and 150g of brown rice",
      "food_name": "Grilled Chicken with Broccoli and Brown Rice",
      "food_description": "A healthy meal consisting of grilled chicken breast, steamed broccoli, and brown rice",
      "food_advice": "Good balanced meal with protein, vegetables, and complex carbs",
      "food_preparation": "Grilled chicken, steamed vegetables, boiled rice",
      "total_protein": 45.5,
      "total_carb": 65.3,
      "total_fat": 5.2,
      "total_fiber": 8.7,
      "total_calorie": 492.8,
      "created_at": "2023-07-01T12:00:00Z",
      "updated_at": "2023-07-01T12:00:00Z"
    },
    "ingredients": [
      {
        "id": 456,
        "food_id": 123,
        "ingredient_name": "Chicken Breast",
        "ingredient_amount": 200,
        "ingredient_protein": 42.0,
        "ingredient_carb": 0,
        "ingredient_fat": 4.4,
        "ingredient_fiber": 0
      },
      {
        "id": 457,
        "food_id": 123,
        "ingredient_name": "Broccoli",
        "ingredient_amount": 100,
        "ingredient_protein": 2.5,
        "ingredient_carb": 6.3,
        "ingredient_fat": 0.3,
        "ingredient_fiber": 3.8
      },
      {
        "id": 458,
        "food_id": 123,
        "ingredient_name": "Brown Rice",
        "ingredient_amount": 150,
        "ingredient_protein": 3.5,
        "ingredient_carb": 59.0,
        "ingredient_fat": 0.5,
        "ingredient_fiber": 4.9
      }
    ],
    "nutritionScore": {
      "score": 85,
      "interpretation": "Good"
    },
    "nutritionComments": {
      "protein": {
        "id": 789,
        "food_id": 123,
        "target_nutrition_id": 321,
        "nutrition_type": "protein",
        "nutrition_delta": 10,
        "nutrition_comment": "Great source of protein",
        "icon": "thumb_up",
        "meal_type": 1
      },
      "carbs": {
        "id": 790,
        "food_id": 123,
        "target_nutrition_id": 321,
        "nutrition_type": "carbs",
        "nutrition_delta": 5,
        "nutrition_comment": "Good amount of complex carbs from brown rice",
        "icon": "check_circle",
        "meal_type": 1
      },
      "fat": {
        "id": 791,
        "food_id": 123,
        "target_nutrition_id": 321,
        "nutrition_type": "fat",
        "nutrition_delta": -15,
        "nutrition_comment": "Low in fat, which aligns with your goals",
        "icon": "check_circle",
        "meal_type": 1
      },
      "fiber": {
        "id": 792,
        "food_id": 123,
        "target_nutrition_id": 321,
        "nutrition_type": "fiber",
        "nutrition_delta": 8,
        "nutrition_comment": "Good source of fiber from vegetables and brown rice",
        "icon": "thumb_up",
        "meal_type": 1
      }
    }
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Text description is required",
  "error": {
    "code": 400,
    "status": "Bad Request"
  }
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Failed to analyze food text",
  "error": {
    "code": 500,
    "status": "Internal Server Error"
  }
}
```

## Notes

- The API requires a target nutrition profile to be set up for the user to calculate nutrition scores and comments.
- If no target nutrition profile exists, the API will still process the text description and save the food data, but will not calculate scores or comments.
- The text description should be as detailed as possible, including food names, quantities, and cooking methods for best results.
- The system uses AI to extract food information, ingredients, and nutritional values from the text description.