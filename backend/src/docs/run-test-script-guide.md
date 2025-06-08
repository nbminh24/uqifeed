# Hướng dẫn chạy script test API nhận diện món ăn

Script test API nhận diện món ăn cho phép bạn kiểm tra tính năng phân tích ảnh thức ăn từ dòng lệnh, mà không cần sử dụng Postman.

## Yêu cầu
- Node.js đã được cài đặt
- Server đang chạy (thường là trên port 5000)
- Một ảnh thức ăn để test

## Cách chạy

### Sử dụng lệnh npm
```bash
# Sử dụng ảnh mặc định và meal_type_id mặc định (2 - Lunch)
npm run test-food-upload

# Hoặc chỉ định đường dẫn ảnh và meal_type_id
npm run test-food-upload -- "C:\đường\dẫn\đến\ảnh.jpg" 1
```

### Sử dụng lệnh node trực tiếp
```bash
# Sử dụng ảnh mặc định và meal_type_id mặc định (2 - Lunch)
node src/scripts/test-food-image-upload.js

# Hoặc chỉ định đường dẫn ảnh
node src/scripts/test-food-image-upload.js "C:\đường\dẫn\đến\ảnh.jpg"

# Hoặc chỉ định cả đường dẫn ảnh và meal_type_id
node src/scripts/test-food-image-upload.js "C:\đường\dẫn\đến\ảnh.jpg" 3
```

## Giá trị meal_type_id
- `1`: Breakfast (Bữa sáng)
- `2`: Lunch (Bữa trưa)
- `3`: Dinner (Bữa tối)
- `4`: Snacks (Bữa nhẹ)

## Kết quả
Script sẽ tự động gửi request đến API và hiển thị kết quả phân tích món ăn trên terminal. Ngoài ra, kết quả chi tiết sẽ được lưu vào file `test-upload-results.json` trong thư mục gốc của project.
