# Food API Documentation

The Food API allows users to analyze food images using the Gemini AI model, save food data with ingredients, and manage their saved foods.

## Endpoints

### Analyze and Save Food
Analyzes a food image using the Gemini API and saves the food data with ingredients.

**URL**: `/api/foods/analyze-and-save`  
**Method**: `POST`  
**Auth required**: Yes (JWT Bearer Token)  

**Request Body**:
```json
{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "meal_type_id": "breakfast"
}
```

**Success Response**:
- **Code**: 201 CREATED
- **Content**:
```json
{
  "status": "success",
  "message": "Food analyzed and saved successfully",
  "data": {
    "food": {
      "id": "food123",
      "user_id": "user123",
      "meal_type_id": "breakfast",
      "food_name": "Bánh Mì Thịt",
      "food_description": {
        "Nguồn gốc và ý nghĩa văn hóa": "...",
        "Hương vị đặc trưng": "...",
        "Phương pháp chế biến truyền thống": "..."
      },
      "food_advice": { ... },
      "food_preparation": { ... },
      "created_at": "2025-05-24T10:30:00Z",
      "updated_at": "2025-05-24T10:30:00Z"
    },
    "ingredients": [
      {
        "id": "ing123",
        "food_id": "food123",
        "ingredient_name": "Bánh mì",
        "ingredient_amount": 100,
        "ingredient_protein": 8,
        "ingredient_carb": 50,
        "ingredient_fat": 2,
        "ingredient_fiber": 3,
        "ingredient_description": { ... },
        "created_at": "2025-05-24T10:30:00Z",
        "updated_at": "2025-05-24T10:30:00Z"
      },
      ...
    ]
  }
}
```

### Get User Foods
Retrieves a list of foods saved by the user, with optional filtering by meal type.

**URL**: `/api/foods`  
**Method**: `GET`  
**Auth required**: Yes (JWT Bearer Token)  

**Query Parameters**:
- `meal_type_id` (optional): Filter foods by meal type
- `limit` (optional): Limit the number of results
- `sortBy` (optional): Field to sort by (default: created_at)
- `sortDir` (optional): Sort direction - 'asc' or 'desc' (default: desc)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "status": "success",
  "message": "Foods retrieved successfully",
  "data": {
    "foods": [
      {
        "id": "food123",
        "user_id": "user123",
        "meal_type_id": "breakfast",
        "food_name": "Bánh Mì Thịt",
        "food_description": { ... },
        "food_advice": { ... },
        "food_preparation": { ... },
        "total_protein": 15,
        "total_carb": 60,
        "total_fat": 8,
        "total_fiber": 5,
        "total_calorie": 372,
        "created_at": "2025-05-24T10:30:00Z",
        "updated_at": "2025-05-24T10:30:00Z"
      },
      ...
    ]
  }
}
```

### Get Food by ID
Retrieves detailed information about a specific food item, including its ingredients.

**URL**: `/api/foods/:id`  
**Method**: `GET`  
**Auth required**: Yes (JWT Bearer Token)  

**URL Parameters**:
- `id`: Food ID

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "status": "success",
  "message": "Food retrieved successfully",
  "data": {
    "food": {
      "id": "food123",
      "user_id": "user123",
      "meal_type_id": "breakfast",
      "food_name": "Bánh Mì Thịt",
      "food_description": { ... },
      "food_advice": { ... },
      "food_preparation": { ... },
      "total_protein": 15,
      "total_carb": 60,
      "total_fat": 8,
      "total_fiber": 5,
      "total_calorie": 372,
      "created_at": "2025-05-24T10:30:00Z",
      "updated_at": "2025-05-24T10:30:00Z"
    },
    "ingredients": [
      {
        "id": "ing123",
        "food_id": "food123",
        "ingredient_name": "Bánh mì",
        "ingredient_amount": 100,
        "ingredient_protein": 8,
        "ingredient_carb": 50,
        "ingredient_fat": 2,
        "ingredient_fiber": 3,
        "ingredient_description": { ... },
        "created_at": "2025-05-24T10:30:00Z",
        "updated_at": "2025-05-24T10:30:00Z"
      },
      ...
    ]
  }
}
```

### Update Food
Updates information about a specific food item.

**URL**: `/api/foods/:id`  
**Method**: `PUT`  
**Auth required**: Yes (JWT Bearer Token)  

**URL Parameters**:
- `id`: Food ID

**Request Body** (all fields optional):
```json
{
  "meal_type_id": "lunch",
  "food_name": "Updated Food Name",
  "food_description": { ... },
  "food_advice": { ... },
  "food_preparation": { ... }
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "status": "success",
  "message": "Food updated successfully",
  "data": {
    "food": {
      "id": "food123",
      "food_name": "Updated Food Name",
      ...
    }
  }
}
```

### Delete Food
Deletes a food item and its associated ingredients.

**URL**: `/api/foods/:id`  
**Method**: `DELETE`  
**Auth required**: Yes (JWT Bearer Token)  

**URL Parameters**:
- `id`: Food ID

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "status": "success",
  "message": "Food and ingredients deleted successfully"
}
```

### Calculate Nutrition
Calculates and updates the total nutritional values for a food based on its ingredients.

**URL**: `/api/foods/:id/calculate-nutrition`  
**Method**: `POST`  
**Auth required**: Yes (JWT Bearer Token)  

**URL Parameters**:
- `id`: Food ID

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "status": "success",
  "message": "Nutritional values calculated and updated successfully",
  "data": {
    "food": {
      "id": "food123",
      "food_name": "Bánh Mì Thịt",
      "total_protein": 15,
      "total_carb": 60,
      "total_fat": 8,
      "total_fiber": 5,
      "total_calorie": 372,
      ...
    }
  }
}
```

## Error Responses

All endpoints can return the following error responses:

**Authentication Error**:
- **Code**: 401 UNAUTHORIZED
- **Content**:
```json
{
  "status": "error",
  "message": "Invalid token"
}
```

**Authorization Error**:
- **Code**: 403 FORBIDDEN
- **Content**:
```json
{
  "status": "error",
  "message": "Not authorized to access this food"
}
```

**Not Found Error**:
- **Code**: 404 NOT FOUND
- **Content**:
```json
{
  "status": "error",
  "message": "Food not found"
}
```

**Validation Error**:
- **Code**: 400 BAD REQUEST
- **Content**:
```json
{
  "status": "error",
  "message": "Image is required"
}
```

**Server Error**:
- **Code**: 500 INTERNAL SERVER ERROR
- **Content**:
```json
{
  "status": "error",
  "message": "Error message"
}
```
