/**
 * Script to test food image upload and analysis
 * 
 * Run with: node src/scripts/test-food-image-upload.js
 */

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Configuration
const API_URL = 'http://10.0.0.233:5000/api';
const IMAGE_PATH = process.argv[2] || 'C:\\Users\\USER\\Downloads\\test.jpg'; // Lấy đường dẫn ảnh từ tham số dòng lệnh
const MEAL_TYPE = process.argv[3] || '2'; // Mặc định là 2 (bữa trưa/lunch)

// Bảng tham chiếu meal_type_id
const MEAL_TYPES = {
    '1': 'Breakfast (Bữa sáng)',
    '2': 'Lunch (Bữa trưa)',
    '3': 'Dinner (Bữa tối)',
    '4': 'Snacks (Bữa nhẹ)'
};

/**
 * Kiểm tra xem file ảnh có tồn tại không
 */
function checkImage() {
    if (!fs.existsSync(IMAGE_PATH)) {
        console.error(`❌ Lỗi: Không tìm thấy file ảnh tại đường dẫn: ${IMAGE_PATH}`);
        console.log('Vui lòng cung cấp đường dẫn chính xác đến file ảnh');
        process.exit(1);
    }

    console.log(`✅ Đã tìm thấy file ảnh: ${path.basename(IMAGE_PATH)}`);
    return true;
}

/**
 * Test API upload và phân tích ảnh món ăn
 */
async function testFoodImageUpload() {
    console.log('\n===== Kiểm tra API upload và phân tích ảnh món ăn =====\n');

    try {        // Kiểm tra meal_type_id
        if (!MEAL_TYPES[MEAL_TYPE]) {
            console.warn(`⚠️ Cảnh báo: meal_type_id không hợp lệ: ${MEAL_TYPE}`);
            console.log('Các giá trị hợp lệ là:');
            for (const [id, name] of Object.entries(MEAL_TYPES)) {
                console.log(`  ${id}: ${name}`);
            }
        }

        // Tạo form data để upload
        const formData = new FormData();
        formData.append('image', fs.createReadStream(IMAGE_PATH));
        formData.append('meal_type_id', MEAL_TYPE);

        console.log(`Đang upload và phân tích ảnh món ăn... (${path.basename(IMAGE_PATH)})`);
        console.log(`Loại bữa ăn: ${MEAL_TYPES[MEAL_TYPE] || MEAL_TYPE}`);

        // Gọi API với form-data (không cần token vì đã có mockAuth)
        const response = await axios.post(
            `${API_URL}/one-stop-analysis/upload`,
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                }
            }
        );

        console.log('\n✅ Upload và phân tích thành công!');
        console.log('Kết quả:');
        console.log(`- Tên món ăn: ${response.data.data.food.food_name}`);
        console.log(`- Điểm dinh dưỡng: ${response.data.data.nutritionScore?.score || 'Không có'}`);
        console.log(`- Số lượng nguyên liệu: ${response.data.data.ingredients.length}`);

        // Lưu kết quả chi tiết vào file JSON để tham khảo
        const outputPath = path.join(__dirname, '../../test-upload-results.json');
        fs.writeFileSync(outputPath, JSON.stringify(response.data, null, 2));
        console.log(`\nĐã lưu kết quả chi tiết vào: ${outputPath}`);

        return response.data;
    } catch (error) {
        console.error('\n❌ Lỗi khi upload và phân tích ảnh:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.log('Lỗi xác thực. Vui lòng kiểm tra token đã cung cấp.');
        }
        throw error;
    }
}

// Thực thi kiểm thử
testFoodImageUpload();
