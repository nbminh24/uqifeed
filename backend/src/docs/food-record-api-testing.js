// API Testing Guide
// This document explains how to test the Food Record API

/*
### Testing the Food Record API

This guide shows examples of how to use the new Food Record API that integrates images with nutritional data.

#### Prerequisites
- Make sure the server is running (`npm start` from the backend directory)
- You need a valid user account (or use the admin account: admin@gmail.com, password: admin)
- Get a valid JWT token by logging in

#### Example API Calls

1. **Create a new food record with an image**

```
POST /api/food-records
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "mealTypeId": "MEAL_TYPE_ID",
  "date": "2023-11-15",
  "mealName": "Avocado Toast",
  "description": "Whole grain toast with avocado and egg",
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

2. **Create a food record with manual nutrition data (no image)**

```
POST /api/food-records
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "mealTypeId": "MEAL_TYPE_ID",
  "date": "2023-11-15",
  "mealName": "Protein Shake",
  "description": "Post-workout protein shake",
  "nutritionData": {
    "calories": 220,
    "protein": 30,
    "carbs": 15,
    "fat": 3,
    "servingSize": "1 scoop (30g)"
  }
}
```

3. **Just process an image (without saving a food record)**

```
POST /api/food-records/process-image
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

4. **Get all user food records**

```
GET /api/food-records
Authorization: Bearer YOUR_JWT_TOKEN
```

5. **Filter food records by meal type**

```
GET /api/food-records?mealTypeId=MEAL_TYPE_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

6. **Filter food records by date range**

```
GET /api/food-records?startDate=2023-11-01&endDate=2023-11-15
Authorization: Bearer YOUR_JWT_TOKEN
```

7. **Get a specific food record**

```
GET /api/food-records/FOOD_RECORD_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

8. **Update a food record**

```
PUT /api/food-records/FOOD_RECORD_ID
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "mealName": "Updated Meal Name",
  "nutritionData": {
    "calories": 350,
    "protein": 25,
    "carbs": 30,
    "fat": 12
  }
}
```

9. **Delete a food record**

```
DELETE /api/food-records/FOOD_RECORD_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

### Response Format

All API endpoints return responses in the following format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data object
  }
}
```

Or in case of an error:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    // Error details (optional)
  }
}
```
*/
