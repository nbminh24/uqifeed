# Hướng dẫn Test API Nhận diện món ăn qua ảnh trên Postman

Hướng dẫn này sẽ giúp bạn test API nhận diện món ăn qua ảnh trực tiếp từ điện thoại hoặc camera bằng Postman.

## 1. Cài đặt Postman

### Trên máy tính
- Tải và cài đặt Postman từ [trang web chính thức](https://www.postman.com/downloads/)

### Trên điện thoại
- **Android**: Tải Postman từ Google Play Store
- **iOS**: Tải Postman từ App Store

## 2. Cấu hình Request trong Postman

### Bước 1: Tạo request mới
1. Mở Postman
2. Nhấn nút "New" hoặc "+" để tạo request mới
3. Chọn "Request"
4. Đặt tên request là "Food Image Analysis" và lưu vào một collection mới hoặc hiện có

### Bước 2: Cấu hình request
1. Chọn phương thức **POST** từ dropdown
2. Nhập URL: `http://localhost:5000/api/one-stop-analysis/upload` (thay đổi host và port nếu cần)
3. **Lưu ý**: Hệ thống đã được cấu hình để tự động xác thực với tài khoản admin mặc định, nên bạn không cần thêm header Authorization

### Bước 3: Thiết lập body
1. Chọn tab **Body**
2. Chọn kiểu **form-data**
3. Thêm hai trường:
   - Key: `image`, Type: `File`, Value: Chọn file ảnh từ thiết bị (nhấn "Select Files" trên máy tính hoặc biểu tượng đính kèm trên điện thoại)
   - Key: `meal_type_id`, Type: `Text`, Value: `1` (hoặc `2` cho bữa trưa, `3` cho bữa tối, `4` cho bữa nhẹ)
     - `1`: Breakfast (Bữa sáng)
     - `2`: Lunch (Bữa trưa)
     - `3`: Dinner (Bữa tối)
     - `4`: Snacks (Bữa nhẹ)

![Cấu hình Postman](https://i.imgur.com/example.png)

### Bước 4: Gửi request
1. Nhấn nút **Send**
2. Đợi phản hồi từ server (có thể mất 5-15 giây tùy thuộc vào kích thước ảnh và tốc độ xử lý)

## 3. Phân tích Kết quả

Kết quả trả về sẽ có định dạng JSON như sau:

```json
{
  "status": "success",
  "message": "Complete food analysis successful",
  "data": {
    "food": {
      "id": "food_id",
      "food_name": "Tên món ăn",
      ...
    },
    "ingredients": [...],
    "nutritionScore": {
      "score": 78,
      "interpretation": "Tốt"
    },
    ...
  }
}
```

### Các thông tin quan trọng trong kết quả:
- **food_name**: Tên món ăn được nhận diện
- **food_description**: Mô tả về món ăn
- **ingredients**: Danh sách nguyên liệu và giá trị dinh dưỡng
- **nutritionScore**: Điểm đánh giá dinh dưỡng

## 4. Xử lý lỗi phổ biến

### Lỗi "Bad Request" (400)
- Kiểm tra đã chọn đúng file ảnh chưa
- Đảm bảo đã điền đúng `meal_type_id` bằng số (1, 2, 3 hoặc 4)

### Lỗi "Internal Server Error" (500)
- Ảnh có thể quá lớn (giới hạn 5MB)
- Định dạng ảnh không được hỗ trợ (chỉ hỗ trợ JPG, PNG, GIF, WEBP)
- Ảnh có thể không rõ ràng khiến hệ thống AI không thể nhận diện
- Server hoặc dịch vụ Gemini AI có thể đang gặp vấn đề, thử lại sau

### Lỗi khác
- Đảm bảo server đang chạy (thường chạy trên port 5000)
- Kiểm tra logs của server để biết thêm chi tiết về lỗi

## 5. Mẹo để có kết quả tốt nhất

- Sử dụng ảnh có độ phân giải tốt, đủ sáng
- Chụp ảnh sao cho món ăn chiếm phần lớn khung hình
- Nếu có nhiều món ăn trong một bữa, hãy chụp và phân tích từng món riêng biệt
- Tránh chụp ảnh quá xa hoặc quá gần

## 6. Chụp ảnh trực tiếp từ Postman trên điện thoại

Trên ứng dụng Postman cho điện thoại, bạn có thể chụp ảnh trực tiếp để test API:

1. Khi thêm trường `image` kiểu `File` trong form-data
2. Nhấn vào biểu tượng camera
3. Chụp ảnh món ăn
4. Xác nhận và gửi request

---

Để xem thêm thông tin chi tiết về API và cách sử dụng, vui lòng tham khảo tài liệu đầy đủ tại `docs/one-stop-analysis-upload-api.md`.
