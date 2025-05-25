# Hướng dẫn sử dụng tính năng phân tích hình ảnh thức ăn

Tính năng phân tích hình ảnh thức ăn sử dụng Google Gemini API để trích xuất thông tin chi tiết về món ăn từ ảnh của người dùng. Dưới đây là hướng dẫn chi tiết về cách triển khai và sử dụng API này.

## Cài đặt

1. Đảm bảo đã cài đặt thư viện Google Generative AI:

```bash
npm install @google/generative-ai
```

2. Thiết lập biến môi trường trong file `.env`:

```
GEMINI_API_KEY=your_gemini_api_key
```

## Kiểm tra kết nối

Để kiểm tra kết nối với Gemini API, chạy script test:

```bash
npm run test-food-analysis
```

Script này sẽ sử dụng một hình ảnh thức ăn từ đường dẫn được cấu hình và lưu kết quả vào file test-results.json.

## API Endpoints

### 1. Phân tích hình ảnh thức ăn và lưu trữ

```
POST /api/food-analysis/analyze-food
```

**Headers:**
- Authorization: Bearer {jwt_token}
- Content-Type: application/json

**Body:**
```json
{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Food image analyzed successfully",
  "data": {
    "image": {
      "id": "image_id",
      "userId": "user_id",
      "createdAt": "2023-05-22T12:34:56.789Z",
      "processingResults": {
        "processed": true,
        "imageType": "image/jpeg",
        "imageSize": 123456,
        "foodData": {
          "foodName": "Pizza Margherita",
          "foodDescription": {
            "origin": "Italian origin dating back to 1889...",
            "flavor": "Light, fresh tomato flavor with creamy mozzarella...",
            "preparation": "Traditional wood-fired oven baking..."
          },
          "ingredients": [
            {
              "name": "Flour",
              "amount": "200g",
              "protein": "7g",
              "fat": "1g",
              "carbs": "43g",
              "fiber": "2g",
              "description": {
                "scientific": "Refined wheat flour...",
                "nutritional": "Source of carbohydrates...",
                "cultural": "Basic ingredient in Italian bread making..."
              }
            },
            // More ingredients...
          ],
          "nutritionAdvice": {
            "analysis": "Good source of carbohydrates but high in sodium...",
            "healthierAlternatives": "Consider whole wheat crust and less cheese...",
            "consumptionTips": "Pair with a salad to balance nutrients..."
          },
          "preparation": [
            "Prepare the dough by mixing flour, water, yeast, and salt",
            "Let it rise for at least 2 hours",
            "Stretch the dough and add toppings",
            "Bake in a hot oven for 8-10 minutes"
          ]
        },
        "timestamp": "2023-05-22T12:34:56.789Z"
      }
    },
    "foodData": {
      // Same as processingResults.foodData above
    }
  }
}
```

### 2. Phân tích hình ảnh thức ăn mà không lưu trữ

```
POST /api/food-analysis/analyze-food-only
```

**Headers:**
- Authorization: Bearer {jwt_token}
- Content-Type: application/json

**Body:**
```json
{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Food image analyzed successfully",
  "data": {
    "foodData": {
      "foodName": "Pizza Margherita",
      "foodDescription": {
        "origin": "Italian origin dating back to 1889...",
        "flavor": "Light, fresh tomato flavor with creamy mozzarella...",
        "preparation": "Traditional wood-fired oven baking..."
      },
      "ingredients": [
        // Ingredients list...
      ],
      "nutritionAdvice": {
        // Nutrition advice...
      },
      "preparation": [
        // Preparation steps...
      ]
    }
  }
}
```

## Cấu trúc dữ liệu phân tích thức ăn

Dữ liệu phân tích thức ăn trả về theo cấu trúc sau:

1. **foodName**: Tên món ăn được nhận diện

2. **foodDescription**: Mô tả chi tiết về món ăn
   - **origin**: Nguồn gốc và ý nghĩa văn hóa
   - **flavor**: Mô tả hương vị
   - **preparation**: Phương pháp chế biến truyền thống

3. **ingredients**: Danh sách nguyên liệu
   - **name**: Tên nguyên liệu
   - **amount**: Lượng ước tính (g)
   - **protein**: Hàm lượng protein (g)
   - **fat**: Hàm lượng chất béo (g)
   - **carbs**: Hàm lượng carbohydrate (g)
   - **fiber**: Hàm lượng chất xơ (g)
   - **description**: Mô tả chi tiết nguyên liệu
     - **scientific**: Mô tả khoa học/thực vật học
     - **nutritional**: Lợi ích dinh dưỡng hoặc đặc tính
     - **cultural**: Ý nghĩa văn hóa hoặc cách sử dụng trong ẩm thực

4. **nutritionAdvice**: Lời khuyên dinh dưỡng
   - **analysis**: Phân tích dinh dưỡng chi tiết
   - **healthierAlternatives**: Gợi ý cải thiện món ăn
   - **consumptionTips**: Lời khuyên khi sử dụng

5. **preparation**: Các bước chế biến món ăn

## Lưu ý

- Dữ liệu trả về từ Gemini API có thể khác nhau tùy thuộc vào chất lượng ảnh và mức độ nhận diện của mô hình.
- Đảm bảo hình ảnh rõ ràng, ánh sáng tốt và món ăn dễ nhận diện để có kết quả chính xác nhất.
- API giới hạn dung lượng ảnh, vì vậy hãy tối ưu kích thước ảnh trước khi gửi lên.
