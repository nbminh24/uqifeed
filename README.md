# UQIFeed Project

UQIFeed là một ứng dụng đa nền tảng về dinh dưỡng và theo dõi thực phẩm với tính năng phân tích hình ảnh và chatbot thông minh.

## Cấu Trúc Dự Án

Dự án được chia thành hai phần chính:

### Frontend (Mobile App)
- Được xây dựng bằng React Native/Expo
- TypeScript làm ngôn ngữ chính
- Giao diện người dùng thân thiện và responsive
- Hỗ trợ chế độ sáng/tối (Dark/Light mode)

### Backend (Server)
- Node.js server
- Firebase làm cơ sở dữ liệu và authentication
- Tích hợp các dịch vụ đám mây (Cloudinary)
- API endpoints cho các tính năng chính

## Tính Năng Chính

1. **Phân Tích Thực Phẩm**
   - Phân tích hình ảnh thực phẩm
   - Phân tích văn bản mô tả thực phẩm
   - Tạo thông tin dinh dưỡng tự động

2. **Theo Dõi Dinh Dưỡng**
   - Theo dõi dinh dưỡng hàng ngày
   - Báo cáo dinh dưỡng theo tuần
   - Thiết lập mục tiêu dinh dưỡng cá nhân

3. **Chatbot Thông Minh**
   - Tư vấn dinh dưỡng
   - Trả lời câu hỏi về thực phẩm
   - Hướng dẫn sử dụng ứng dụng

4. **Quản Lý Thực Phẩm**
   - Tạo và chỉnh sửa thông tin thực phẩm
   - Lịch sử thực phẩm đã dùng
   - Quản lý thành phần

## Cài Đặt và Chạy Dự Án

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Yêu Cầu Hệ Thống

### Frontend
- Node.js >= 14.0.0
- Expo CLI
- React Native development environment

### Backend
- Node.js >= 14.0.0
- Firebase account và credentials
- Các biến môi trường cần thiết (xem file env-example.txt)

## Tài Liệu

Chi tiết về từng phần có thể được tìm thấy trong:
- Frontend: `/frontend/README.md`
- Backend: `/backend/README.md`
- API Documentation: `/backend/docs`

## Công Nghệ Sử Dụng

### Frontend
- React Native/Expo
- TypeScript
- React Navigation
- Các thư viện UI components tùy chỉnh

### Backend
- Node.js
- Express.js
- Firebase (Authentication & Firestore)
- Cloudinary (Quản lý hình ảnh)

## Đóng Góp

Vui lòng đọc hướng dẫn đóng góp trong từng thư mục con trước khi bắt đầu.

## Giấy Phép

Dự án này được phân phối dưới giấy phép [MIT License](LICENSE).
