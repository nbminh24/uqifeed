# Nutrition Comment API

API cho tính năng tạo và quản lý các nhận xét dinh dưỡng trong ứng dụng UQIFeed.

## Giới thiệu

Nutrition Comment API cho phép tạo và quản lý các nhận xét dinh dưỡng dựa trên sự chênh lệch giữa dinh dưỡng của thực phẩm và mục tiêu dinh dưỡng của người dùng. Các nhận xét này cung cấp thông tin chi tiết và gợi ý về từng loại dinh dưỡng (protein, chất béo, carbohydrate, chất xơ và calories).

## Endpoints

### Tạo nhận xét dinh dưỡng

Tạo và lưu các nhận xét dinh dưỡng cho một thực phẩm dựa trên mục tiêu dinh dưỡng.

```
POST /api/nutrition/comments/generate/:foodId/:targetNutritionId
```

**Yêu cầu xác thực:** Có

**Parameters:**
- `foodId`: ID của thực phẩm
- `targetNutritionId`: ID của mục tiêu dinh dưỡng

**Phản hồi:**
```json
{
  "success": true,
  "message": "Nutrition comments generated successfully",
  "data": {
    "protein": {
      "id": "comment-id-1",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Protein",
      "nutrition_delta": 24,
      "nutrition_comment": "Cần tăng nhẹ lượng protein, nhất là nếu có tập luyện hoặc cần duy trì khối cơ.",
      "icon": "🥩",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "fat": {
      "id": "comment-id-2",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Fat",
      "nutrition_delta": 25,
      "nutrition_comment": "Có thể thêm chút chất béo tốt để cân bằng năng lượng và nội tiết.",
      "icon": "🥑",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "carbs": {
      "id": "comment-id-3",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Carb",
      "nutrition_delta": 7,
      "nutrition_comment": "Nên bổ sung carb từ ngũ cốc nguyên hạt, trái cây hoặc khoai để đảm bảo năng lượng.",
      "icon": "🍚",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "fiber": {
      "id": "comment-id-4",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Fiber",
      "nutrition_delta": 11,
      "nutrition_comment": "Nên tăng cường rau, trái cây và ngũ cốc nguyên hạt để hỗ trợ tiêu hóa và kiểm soát đường huyết.",
      "icon": "🥦",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "calories": {
      "id": "comment-id-5",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Calorie",
      "nutrition_delta": 16,
      "nutrition_comment": "Nên tăng năng lượng nạp vào để tránh thiếu hụt dinh dưỡng và giảm trao đổi chất.",
      "icon": "🔥",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    }
  }
}
```

### Lấy nhận xét dinh dưỡng cho một thực phẩm

Lấy tất cả các nhận xét dinh dưỡng đã được tạo cho một thực phẩm.

```
GET /api/nutrition/comments/food/:foodId
```

**Yêu cầu xác thực:** Có

**Parameters:**
- `foodId`: ID của thực phẩm

**Phản hồi:**
```json
{
  "success": true,
  "message": "Nutrition comments retrieved successfully",
  "data": {
    "protein": {
      "id": "comment-id-1",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Protein",
      "nutrition_delta": 24,
      "nutrition_comment": "Cần tăng nhẹ lượng protein, nhất là nếu có tập luyện hoặc cần duy trì khối cơ.",
      "icon": "🥩",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "fat": {
      "id": "comment-id-2",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Fat",
      "nutrition_delta": 25,
      "nutrition_comment": "Có thể thêm chút chất béo tốt để cân bằng năng lượng và nội tiết.",
      "icon": "🥑",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "carbs": {
      "id": "comment-id-3",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Carb",
      "nutrition_delta": 7,
      "nutrition_comment": "Nên bổ sung carb từ ngũ cốc nguyên hạt, trái cây hoặc khoai để đảm bảo năng lượng.",
      "icon": "🍚",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "fiber": {
      "id": "comment-id-4",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Fiber",
      "nutrition_delta": 11,
      "nutrition_comment": "Nên tăng cường rau, trái cây và ngũ cốc nguyên hạt để hỗ trợ tiêu hóa và kiểm soát đường huyết.",
      "icon": "🥦",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    },
    "calories": {
      "id": "comment-id-5",
      "food_id": "food-id",
      "target_nutrition_id": "target-id",
      "nutrition_type": "Calorie",
      "nutrition_delta": 16,
      "nutrition_comment": "Nên tăng năng lượng nạp vào để tránh thiếu hụt dinh dưỡng và giảm trao đổi chất.",
      "icon": "🔥",
      "created_at": "2025-05-25T10:00:00.000Z",
      "updated_at": "2025-05-25T10:00:00.000Z"
    }
  }
}
```

### Lấy nhận xét dinh dưỡng theo ID

Lấy một nhận xét dinh dưỡng cụ thể theo ID.

```
GET /api/nutrition/comments/:commentId
```

**Yêu cầu xác thực:** Có

**Parameters:**
- `commentId`: ID của nhận xét dinh dưỡng

**Phản hồi:**
```json
{
  "success": true,
  "message": "Nutrition comment retrieved successfully",
  "data": {
    "id": "comment-id-1",
    "food_id": "food-id",
    "target_nutrition_id": "target-id",
    "nutrition_type": "Protein",
    "nutrition_delta": 24,
    "nutrition_comment": "Cần tăng nhẹ lượng protein, nhất là nếu có tập luyện hoặc cần duy trì khối cơ.",
    "icon": "🥩",
    "created_at": "2025-05-25T10:00:00.000Z",
    "updated_at": "2025-05-25T10:00:00.000Z"
  }
}
```

### Cập nhật nhận xét dinh dưỡng

Cập nhật nội dung của một nhận xét dinh dưỡng.

```
PUT /api/nutrition/comments/:commentId
```

**Yêu cầu xác thực:** Có

**Parameters:**
- `commentId`: ID của nhận xét dinh dưỡng

**Request Body:**
```json
{
  "nutrition_comment": "Nên bổ sung thêm đạm từ thực phẩm chay như đậu phụ, đậu lăng, quinoa để tăng cường sức khỏe."
}
```

**Phản hồi:**
```json
{
  "success": true,
  "message": "Nutrition comment updated successfully",
  "data": {
    "id": "comment-id-1",
    "nutrition_comment": "Nên bổ sung thêm đạm từ thực phẩm chay như đậu phụ, đậu lăng, quinoa để tăng cường sức khỏe.",
    "updated_at": "2025-05-25T11:00:00.000Z"
  }
}
```

### Xóa nhận xét dinh dưỡng

Xóa một nhận xét dinh dưỡng cụ thể.

```
DELETE /api/nutrition/comments/:commentId
```

**Yêu cầu xác thực:** Có

**Parameters:**
- `commentId`: ID của nhận xét dinh dưỡng

**Phản hồi:**
```json
{
  "success": true,
  "message": "Nutrition comment deleted successfully"
}
```

### Xóa tất cả nhận xét dinh dưỡng cho một thực phẩm

Xóa tất cả các nhận xét dinh dưỡng cho một thực phẩm cụ thể.

```
DELETE /api/nutrition/comments/food/:foodId
```

**Yêu cầu xác thực:** Có

**Parameters:**
- `foodId`: ID của thực phẩm

**Phản hồi:**
```json
{
  "success": true,
  "message": "Nutrition comments deleted successfully"
}
```

## Các loại nhận xét dinh dưỡng

Hệ thống tạo nhận xét cho 5 loại dinh dưỡng:

1. **Protein (🥩)**: Đánh giá lượng protein trong thực phẩm so với mục tiêu.
2. **Chất béo (🥑)**: Đánh giá lượng chất béo trong thực phẩm so với mục tiêu.
3. **Carbohydrate (🍚)**: Đánh giá lượng carbohydrate trong thực phẩm so với mục tiêu.
4. **Chất xơ (🥦)**: Đánh giá lượng chất xơ trong thực phẩm so với mục tiêu.
5. **Calories (🔥)**: Đánh giá lượng calories tổng thể trong thực phẩm so với mục tiêu.

## Phân loại nhận xét

Các nhận xét được phân loại dựa trên tỷ lệ phần trăm của dinh dưỡng trong thực phẩm so với mục tiêu:

- **<70%**: Thiếu nhiều
- **70-90%**: Thiếu nhẹ
- **90-110%**: Cân đối
- **110-130%**: Thừa nhẹ
- **>130%**: Thừa nhiều

Mỗi mức độ có một nhận xét cụ thể và gợi ý phù hợp với loại dinh dưỡng.
