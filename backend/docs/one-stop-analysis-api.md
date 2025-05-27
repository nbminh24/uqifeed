# One-Stop Analysis API Documentation

## Overview

The One-Stop Analysis API provides a comprehensive workflow for food nutrition analysis from a single API endpoint. It integrates image recognition, food analysis, nutrition calculation, and personalized feedback in one request.

## Endpoint

```
POST /api/one-stop-analysis
```

## Authentication

This endpoint requires authentication. Include a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Request Body

| Parameter    | Type   | Required | Description                                 |
|--------------|--------|----------|---------------------------------------------|
| base64Image  | String | Yes      | Base64 encoded image of the food            |
| meal_type_id | Number | Yes      | ID of the meal type (breakfast, lunch, etc.)|

### Example Request

```json
{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgAB...",
  "meal_type_id": 1
}
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Complete food analysis successful",
  "data": {
    "food": {
      "id": 123,
      "user_id": 456,
      "meal_type_id": 1,
      "food_name": "Grilled Chicken Salad",
      "food_description": "A healthy salad with grilled chicken",
      "food_advice": "Good source of protein",
      "food_preparation": "Grilled and mixed",
      "total_protein": 25.5,
      "total_carb": 15.3,
      "total_fat": 8.2,
      "total_fiber": 4.7,
      "total_calorie": 237.8,
      "created_at": "2023-07-01T12:00:00Z",
      "updated_at": "2023-07-01T12:00:00Z"
    },
    "ingredients": [
      {
        "id": 456,
        "food_id": 123,
        "ingredient_name": "Chicken Breast",
        "ingredient_amount": 100,
        "ingredient_protein": 20.5,
        "ingredient_carb": 0,
        "ingredient_fat": 3.2,
        "ingredient_fiber": 0
      },
      {
        "id": 457,
        "food_id": 123,
        "ingredient_name": "Lettuce",
        "ingredient_amount": 50,
        "ingredient_protein": 0.5,
        "ingredient_carb": 2.3,
        "ingredient_fat": 0.1,
        "ingredient_fiber": 1.5
      }
      // Additional ingredients...
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
        "nutrition_delta": -5,
        "nutrition_comment": "Low in carbs, which is good for your goals",
        "icon": "check_circle",
        "meal_type": 1
      }
      // Additional nutrition comments...
    }
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Image is required",
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
  "message": "Failed to analyze food image",
  "error": {
    "code": 500,
    "status": "Internal Server Error"
  }
}
```

## Notes

- The API requires a target nutrition profile to be set up for the user to calculate nutrition scores and comments.
- If no target nutrition profile exists, the API will still process the image and save the food data, but will not calculate scores or comments.
- The base64Image should include the data URI prefix (e.g., "data:image/jpeg;base64,").
