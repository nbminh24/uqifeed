# Hướng dẫn sử dụng API Phân tích ảnh món ăn qua upload file

Tài liệu này hướng dẫn cách sử dụng API phân tích ảnh món ăn thông qua việc upload file trực tiếp, thay vì sử dụng chuỗi base64.

## Đặc điểm API

API này cho phép:
- Upload ảnh món ăn trực tiếp từ thiết bị (điện thoại, máy tính)
- Phân tích món ăn và nhận diện thành phần
- Tính toán giá trị dinh dưỡng
- Lưu trữ dữ liệu món ăn vào cơ sở dữ liệu

## Endpoint

```
POST /api/one-stop-analysis/upload
```

## Headers

API đã được cấu hình để tự động xác thực với tài khoản admin mặc định, nên bạn không cần thêm header Authorization khi test.

## Body (form-data)

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| image | File | File ảnh món ăn (jpg, jpeg, png, webp) |
| meal_type_id | Text | ID loại bữa ăn (1: Breakfast, 2: Lunch, 3: Dinner, 4: Snacks) |

## Phản hồi

```json
{
  "status": "success",
  "message": "Complete food analysis successful",
  "data": {
    "food": {
      "id": "food_id",
      "user_id": "user_id",
      "meal_type_id": "lunch",
      "food_name": "Tên món ăn",
      "food_description": {
        "Nguồn gốc và ý nghĩa văn hóa": "...",
        "Hương vị đặc trưng": "...",
        "Phương pháp chế biến truyền thống": "..."
      },
      "food_advice": {
        "Nutrition Summary": "...",
        "Healthier Suggestions": "...",
        "Consumption Tips": "..."
      },
      "total_protein": 30,
      "total_carb": 45,
      "total_fat": 15,
      "total_fiber": 5,
      "total_calorie": 435
    },
    "ingredients": [
      {
        "id": "ingredient_id",
        "food_id": "food_id",
        "ingredient_name": "Tên nguyên liệu",
        "ingredient_amount": "100g",
        "ingredient_description": {
          "Nguồn gốc & mô tả dân dã": "...",
          "Lợi ích dinh dưỡng": "..."
        },
        "ingredient_protein": 10,
        "ingredient_carb": 15,
        "ingredient_fat": 5,
        "ingredient_fiber": 2
      }
    ],
    "originalFilename": "tên_file_gốc.jpg",
    "nutritionScore": {
      "score": 78,
      "interpretation": "Tốt"
    },
    "nutritionComments": {
      "protein": {
        "nutrition_delta": 5,
        "nutrition_comment": "Lượng protein phù hợp..."
      },
      "carb": {
        "nutrition_delta": -10,
        "nutrition_comment": "Lượng carb cao hơn mức khuyến nghị..."
      }
    }
  }
}
```

## Lưu ý

- Kích thước tệp tối đa: 5MB
- Định dạng hỗ trợ: JPEG, PNG, GIF, WEBP
- Ảnh nên rõ ràng, ánh sáng tốt để có kết quả phân tích chính xác
- Hãy đảm bảo rằng món ăn chiếm phần lớn khung hình
