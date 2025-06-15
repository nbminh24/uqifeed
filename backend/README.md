# UQIFeed Backend API Documentation

## Giới thiệu

UQIFeed là một ứng dụng phân tích và đánh giá dinh dưỡng thực phẩm. Backend API cung cấp các endpoint để phân tích thực phẩm qua hình ảnh hoặc văn bản, tính toán điểm dinh dưỡng và tạo nhận xét dinh dưỡng cá nhân hóa.

## Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 14
- Firebase Admin SDK
- Google Cloud Vision API
- Google Gemini API
- Cloudinary account

### Các bước cài đặt

1. Clone repository và cài đặt dependencies:
```bash
git clone <repository-url>
cd backend
npm install
```

2. Cấu hình môi trường:
  - Firebase credentials
  - Cloudinary credentials
  - Gemini API keys
  - Port (mặc định: 5000)

3. Khởi tạo dữ liệu ban đầu:
```bash
# Tạo admin user
npm run create-admin

# Tạo admin profile
npm run create-admin-profile

# Tính toán dinh dưỡng cho admin
npm run calculate-admin-nutrition

# Tạo các loại bữa ăn
npm run create-meal-types
```

4. Chạy server:
```bash
# Development với nodemon
npm run dev

# Production
npm start
```

## Cấu trúc Project

```
backend/
├── src/
│   ├── app.js              # Entry point
│   ├── config/             # Cấu hình (Firebase, Cloudinary, etc.)
│   ├── controllers/        # API Controllers
│   ├── middleware/         # Middleware (auth, validation, etc.)
│   ├── models/            # Models và business logic
│   ├── routes/            # API routes
│   ├── services/          # External services (AI, image processing)
│   └── utils/             # Helper functions
├── services/              # Service account keys
├── docs/                  # API Documentation
├── env-example           # Template cho .env
├── firebase.json         # Firebase config
└── package.json
```

## Scripts

- `npm start`: Chạy server trong môi trường production
- `npm run dev`: Chạy server với nodemon (hot reload)
- `npm run create-admin`: Tạo tài khoản admin
- `npm run create-admin-profile`: Tạo profile cho admin
- `npm run calculate-admin-nutrition`: Tính toán dinh dưỡng cho admin
- `npm run create-meal-types`: Tạo các loại bữa ăn mặc định

## API Endpoints

### 1. One-Stop Analysis API

#### Phân tích thực phẩm từ hình ảnh
```http
POST /api/one-stop-analysis
```

Phân tích toàn diện thực phẩm từ hình ảnh bao gồm:
- Nhận diện thực phẩm
- Tính toán giá trị dinh dưỡng
- Điểm dinh dưỡng
- Nhận xét dinh dưỡng cá nhân hóa

**Request Body:**
```json
{
  "base64Image": "data:image/jpeg;base64,...",
  "meal_type_id": 1
}
```

#### Phân tích thực phẩm từ văn bản
```http
POST /api/one-stop-text-analysis
```

Phân tích toàn diện thực phẩm từ mô tả văn bản bao gồm:
- Phân tích thực phẩm từ văn bản
- Tính toán giá trị dinh dưỡng
- Điểm dinh dưỡng
- Nhận xét dinh dưỡng cá nhân hóa

**Request Body:**
```json
{
  "textDescription": "200g grilled chicken breast with steamed broccoli...",
  "meal_type_id": 1
}
```

### 2. Nutrition Score API

#### Tính và lưu điểm dinh dưỡng
```http
POST /api/nutrition/score/:foodId
```

Tính điểm dựa trên công thức:
1. % so với mục tiêu của mỗi chất dinh dưỡng
2. Độ lệch tuyệt đối so với 100%
3. Trọng số:
   - Calories: 30%
   - Protein: 20%
   - Chất béo: 15%
   - Carbs: 15%
   - Chất xơ: 20%
4. Điểm = 100 - (độ lệch có trọng số / 2)

Thang điểm đánh giá:
- 80-100: Xuất sắc
- 60-79: Tốt
- 40-59: Trung bình
- 20-39: Kém
- 0-19: Rất kém

### 3. Meal Nutrition Score API

#### Tính điểm dinh dưỡng theo bữa ăn
```http
POST /api/nutrition/meal-score
```

Đánh giá dinh dưỡng theo bối cảnh bữa ăn:
- Bữa sáng: 25% nhu cầu hàng ngày
- Bữa trưa: 35% nhu cầu hàng ngày
- Bữa tối: 35% nhu cầu hàng ngày
- Ăn nhẹ: 5% nhu cầu hàng ngày

**Request Body:**
```json
{
  "foodIds": ["food_id_1", "food_id_2"],
  "mealType": "lunch"
}
```

### 4. Nutrition Comments API

#### Tạo nhận xét dinh dưỡng
```http
POST /api/nutrition/comments/generate/:foodId/:targetNutritionId
```

Tạo nhận xét chi tiết và gợi ý cho từng loại dinh dưỡng (protein, chất béo, carbs, chất xơ, calories) dựa trên sự chênh lệch với mục tiêu dinh dưỡng của người dùng.

#### Lấy nhận xét dinh dưỡng
```http
GET /api/nutrition/comments/food/:foodId
```

## Xác thực

Tất cả các API endpoints đều yêu cầu xác thực bằng JWT token:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Lỗi và Xử lý

API trả về response với format thống nhất:
```json
{
  "success": true/false,
  "message": "Thông báo thành công/lỗi",
  "data": {...}  // Dữ liệu trả về nếu thành công
}
```

## Development

### Môi trường phát triển

1. IDE được khuyến nghị: Visual Studio Code với các extension:
   - ESLint
   - Prettier
   - REST Client (để test API)

2. Công cụ phát triển:
   - Postman hoặc Insomnia để test API
   - Firebase CLI để quản lý Firebase
   - Firebase Emulator để test offline

### API Testing

Bạn có thể test API bằng cách:
1. Sử dụng collection Postman được cung cấp trong `/docs/postman`
2. Chạy các script test có sẵn:
   ```bash
   npm run test-food-analysis
   npm run test-food-upload
   ```

### Debugging

1. Sử dụng morgan middleware để log HTTP requests
2. Kiểm tra logs trong Firebase Console
3. Sử dụng console.log() với các tag rõ ràng cho từng module

### Deployment

1. Build và deploy lên Firebase:
   ```bash
   firebase deploy --only functions
   ```

2. Hoặc deploy lên server riêng:
   ```bash
   # Build
   npm run build

   # Start với PM2
   pm2 start src/app.js --name "uqifeed-backend"
   ```

## Contributing

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/xyz`
3. Commit changes: `git commit -am 'Add feature xyz'`
4. Push to branch: `git push origin feature/xyz`
5. Submit Pull Request

## License

ISC License - See LICENSE.md for details
