# Meal Nutrition Score API Documentation

Tài liệu này mô tả các API đánh giá dinh dưỡng theo bữa ăn (Meal Nutrition Score) trong ứng dụng UQIFeed.

## Tổng quan

Tính năng đánh giá dinh dưỡng theo bữa ăn cho phép người dùng đánh giá các món ăn theo bối cảnh bữa ăn cụ thể, giúp xác định mức độ phù hợp dinh dưỡng chính xác hơn so với việc đánh giá từng món riêng lẻ.

## Cách tính điểm dinh dưỡng theo bữa ăn

Điểm dinh dưỡng theo bữa ăn được tính theo hai cách:

1. **Đánh giá nhiều món ăn cùng lúc**: Tổng hợp giá trị dinh dưỡng của nhiều món ăn và so sánh với mục tiêu dinh dưỡng hàng ngày.

2. **Đánh giá theo loại bữa ăn**: Điều chỉnh mục tiêu dinh dưỡng dựa trên loại bữa ăn (sáng, trưa, tối, ăn nhẹ) và tỷ lệ dinh dưỡng tương ứng:
   - Bữa sáng: 25% nhu cầu dinh dưỡng hàng ngày
   - Bữa trưa: 35% nhu cầu dinh dưỡng hàng ngày
   - Bữa tối: 35% nhu cầu dinh dưỡng hàng ngày
   - Ăn nhẹ: 5% nhu cầu dinh dưỡng hàng ngày

## Công thức tính điểm

Điểm dinh dưỡng được tính dựa trên công thức sau:

1. Tính tổng giá trị dinh dưỡng của tất cả các món ăn:
   ```
   combinedNutrition = {
     total_calorie: tổng calories của tất cả các món,
     total_protein: tổng protein của tất cả các món,
     total_fat: tổng chất béo của tất cả các món,
     total_carb: tổng carbs của tất cả các món,
     total_fiber: tổng chất xơ của tất cả các món
   }
   ```

2. Điều chỉnh mục tiêu dinh dưỡng theo loại bữa ăn (nếu có):
   ```
   adjustedTarget = {
     calories: targetNutrition.daily.calories * portionMultiplier,
     protein: targetNutrition.daily.protein * portionMultiplier,
     fat: targetNutrition.daily.fat * portionMultiplier,
     carbs: targetNutrition.daily.carbs * portionMultiplier,
     fiber: targetNutrition.daily.fiber * portionMultiplier
   }
   ```

3. Tính phần trăm của mỗi chất dinh dưỡng so với mục tiêu đã điều chỉnh.

4. Tính độ lệch tuyệt đối so với 100% cho mỗi chất dinh dưỡng.

5. Áp dụng trọng số cho mỗi độ lệch:
   - Calories: 30%
   - Protein: 20%
   - Chất béo: 15%
   - Carbs: 15%
   - Chất xơ: 20%

6. Chuyển đổi thành điểm (0-100):
   ```
   score = 100 - (weightedDeviation / 2)
   ```

## API Endpoints

### Tính điểm dinh dưỡng cho nhiều món ăn

Tính điểm dinh dưỡng cho nhiều món ăn cùng lúc.

- **URL**: `/api/nutrition/meal-score`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "foodIds": ["food_id_1", "food_id_2", "food_id_3"],
    "mealType": "lunch" // Optional: "breakfast", "lunch", "dinner", "snack"
  }
  ```

**Success Response**:
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Meal nutrition score calculated successfully",
    "data": {
      "score": 85,
      "interpretation": {
        "rating": "Very Good",
        "description": "This meal is a great match for your nutritional needs."
      },
      "comparisons": {
        "calories": {
          "food": 800,
          "target": 844.2, // 35% of daily target for lunch
          "percentage": 95,
          "deviation": 5
        },
        "protein": {
          "food": 40,
          "target": 42.35,
          "percentage": 94,
          "deviation": 6
        },
        "fat": { ... },
        "carbs": { ... },
        "fiber": { ... }
      },
      "mealType": "lunch",
      "combinedNutrition": {
        "total_calorie": 800,
        "total_protein": 40,
        "total_fat": 25,
        "total_carb": 80,
        "total_fiber": 12
      },
      "foods": [
        {
          "id": "food_id_1",
          "name": "Food Name 1",
          "calories": 300,
          "protein": 15,
          "fat": 10,
          "carbs": 30,
          "fiber": 5
        },
        {
          "id": "food_id_2",
          "name": "Food Name 2",
          "calories": 500,
          "protein": 25,
          "fat": 15,
          "carbs": 50,
          "fiber": 7
        }
      ]
    }
  }
  ```

**Error Responses**:
- **Code**: 400 Bad Request
  - Thiếu mảng foodIds hoặc mảng rỗng
  - Loại bữa ăn không hợp lệ
  - Món ăn không có giá trị dinh dưỡng
- **Code**: 404 Not Found
  - Không tìm thấy mục tiêu dinh dưỡng của người dùng
  - Không tìm thấy món ăn với ID đã cho
- **Code**: 500 Internal Server Error
  - Lỗi khi tính điểm dinh dưỡng cho bữa ăn

### Tính điểm dinh dưỡng cho bản ghi thực phẩm

Tính điểm dinh dưỡng cho một bản ghi thực phẩm (food record) có thể chứa nhiều món ăn.

- **URL**: `/api/nutrition/food-record-score/:recordId`
- **Method**: `GET`
- **Authentication**: Required
- **URL Parameters**:
  - `recordId`: ID của bản ghi thực phẩm

**Success Response**:
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Food record nutrition score calculated successfully",
    "data": {
      "score": 85,
      "interpretation": {
        "rating": "Very Good",
        "description": "This meal is a great match for your nutritional needs."
      },
      "comparisons": { ... },
      "mealType": "dinner",
      "combinedNutrition": { ... },
      "recordName": "My Dinner",
      "recordDate": "2023-05-24T00:00:00.000Z",
      "foods": [ ... ]
    }
  }
  ```

**Error Responses**:
- **Code**: 400 Bad Request
  - Bản ghi thực phẩm không chứa món ăn nào
  - Không tìm thấy món ăn hợp lệ trong bản ghi
- **Code**: 403 Forbidden
  - Không có quyền truy cập bản ghi thực phẩm này
- **Code**: 404 Not Found
  - Không tìm thấy bản ghi thực phẩm
  - Không tìm thấy mục tiêu dinh dưỡng của người dùng
- **Code**: 500 Internal Server Error
  - Lỗi khi tính điểm dinh dưỡng cho bản ghi thực phẩm

## Ví dụ sử dụng

### Ví dụ 1: Tính điểm dinh dưỡng cho bữa trưa với nhiều món ăn

```javascript
// Tính điểm dinh dưỡng cho bữa trưa với nhiều món ăn
async function calculateLunchScore(foodIds) {
  try {
    const response = await fetch('/api/nutrition/meal-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        foodIds: foodIds,
        mealType: 'lunch'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Meal score:', data.data.score);
      console.log('Rating:', data.data.interpretation.rating);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error calculating meal score:', error);
    throw error;
  }
}
```

### Ví dụ 2: Tính điểm dinh dưỡng cho một bản ghi thực phẩm

```javascript
// Tính điểm dinh dưỡng cho một bản ghi thực phẩm
async function calculateFoodRecordScore(recordId) {
  try {
    const response = await fetch(`/api/nutrition/food-record-score/${recordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Food record score:', data.data.score);
      console.log('Rating:', data.data.interpretation.rating);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error calculating food record score:', error);
    throw error;
  }
}
```
