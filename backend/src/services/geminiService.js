const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

/**
 * Gemini Service
 * Handles interactions with Google's Gemini API for image analysis
 */
class GeminiService {
    constructor() {
        // Trực tiếp đọc file .env để đảm bảo lấy được GEMINI_API_KEY
        const envPath = path.resolve(__dirname, '../../.env');
        console.log('Path to .env file:', envPath);

        let geminiApiKey = process.env.GEMINI_API_KEY;

        // Nếu không tìm thấy trong biến môi trường, đọc trực tiếp từ file
        if (!geminiApiKey && fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
            if (match && match[1]) {
                geminiApiKey = match[1];
                console.log('GEMINI_API_KEY loaded from file');
            }
        }

        console.log('GEMINI_API_KEY:', geminiApiKey ? 'Defined' : 'Undefined');

        // Make sure API key is loaded
        if (!geminiApiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables or .env file');
        }

        this.genAI = new GoogleGenerativeAI(geminiApiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    /**
     * Analyze a food image and extract detailed information
     * @param {String} base64Image - Base64 encoded image string
     * @returns {Object} Detailed food information
     */
    async analyzeFoodImage(base64Image) {
        try {
            if (!base64Image) {
                throw new Error('No base64 image provided');
            }

            // Extract the mime type and actual base64 data
            const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

            if (!matches || matches.length !== 3) {
                throw new Error('Invalid base64 string');
            }

            const mimeType = matches[1];
            const base64Data = matches[2];

            // Prepare the image for Gemini API
            const imagePart = {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            };            // Prepare the prompt for the model
            const prompt = `
            🧠 Phân tích ảnh món ăn và xuất thông tin chi tiết

            Yêu cầu:
            Phân tích ảnh món ăn và trả về các thông tin chi tiết bên dưới. Luôn nói một cách khẳng định và cụ thể. Không sử dụng bất kỳ từ ngữ nào mang tính suy đoán như "có thể là", "có vẻ như", "likely", "possibly"...

            Trả về kết quả theo định dạng JSON với cấu trúc sau:
            {
              "foodName": "Tên món ăn rõ ràng và cụ thể",
              "foodDescription": {
                "Nguồn gốc và ý nghĩa văn hóa": "Mô tả nguồn gốc và văn hóa món ăn (bằng ngôn ngữ dân dã, dễ hiểu)",
                "Hương vị đặc trưng": "Mô tả vị giác nổi bật (giòn, béo, chua, cay, ngọt...)",
                "Phương pháp chế biến truyền thống": "Tóm tắt phương pháp nấu chính (luộc, chiên, nướng...)"
              },
              "foodIngredientList": [
                {
                  "Ingredient Name": "Tên nguyên liệu",
                  "Ingredient Amount": "Lượng (100g, 1 củ...)",
                  "Ingredient Protein": "Lượng protein (g)",
                  "Ingredient Fat": "Lượng chất béo (g)",
                  "Ingredient Carb": "Lượng carbohydrate (g)",
                  "Ingredient Fiber": "Lượng chất xơ (g)",
                  "Ingredient Description": {
                    "Nguồn gốc & mô tả dân dã": "Mô tả gần gũi, dễ hiểu",
                    "Lợi ích dinh dưỡng": "Các điểm mạnh về sức khỏe",
                    "Cách dùng trong ẩm thực": "Cách thường dùng trong ẩm thực"
                  }
                }
              ],
              "foodAdvice": {
                "Nutrition Summary": "Tóm tắt giá trị dinh dưỡng của món ăn",
                "Healthier Suggestions": "Gợi ý cách làm món ăn lành mạnh hơn",
                "Consumption Tips": "Lời khuyên về khẩu phần, tần suất ăn, món kết hợp"
              },
              "foodPreparation": {
                "Cách làm": [
                  "Bước 1: ...",
                  "Bước 2: ...",
                  "..."
                ]
              }
            }

            Hướng dẫn cụ thể:

            1. 🏷️ Tên món ăn (foodName):
            Cung cấp tên món ăn chính xác. Nếu không biết chính xác tên món, hãy đặt tên cụ thể dựa trên các nguyên liệu chính, theo kiểu: [Cách chế biến] + [Nguyên liệu chính] (ví dụ: Salad gà và cà chua, Cơm chiên trứng và đậu, Mì xào rau củ,...).

            2. 📜 Mô tả món ăn (foodDescription):
            Mô tả món ăn với ba nội dung rõ ràng về nguồn gốc văn hóa, hương vị đặc trưng và phương pháp chế biến.

            3. 🧂 Danh sách nguyên liệu (foodIngredientList):
            Liệt kê tất cả các nguyên liệu có thể thấy trong hình ảnh. Cho mỗi nguyên liệu:
            - Xác định chính xác lượng sử dụng, sử dụng đơn vị phù hợp (g, ml, cup, muỗng, v.v.)
            - Ước tính các giá trị dinh dưỡng cho mỗi 100g nguyên liệu
            - Bổ sung thông tin chi tiết về đặc điểm của nguyên liệu (màu sắc, kích thước, độ tươi)
            
            Ví dụ cách ước tính lượng nguyên liệu:
            - Rau xanh: Nhận diện số lượng rau và ước tính gram (1 bát rau ~ 100g)
            - Thịt: Nhận diện kích thước miếng và ước tính gram (1 miếng thịt loại vừa ~ 100g)
            - Nước sốt/gia vị: Ước tính theo muỗng hoặc ml (1 muỗng canh ~ 15ml)
            - Ngũ cốc: Ước tính theo chén hoặc gram (1 chén cơm ~ 150g)

            4. 🧠 Phân tích dinh dưỡng & lời khuyên (foodAdvice):
            Cung cấp tóm tắt dinh dưỡng, đề xuất cách làm lành mạnh hơn và lời khuyên khi sử dụng.

            5. 🍳 Cách chế biến món ăn (foodPreparation):
            Liệt kê các bước nấu món ăn một cách rõ ràng và tuần tự.

            Hướng dẫn tính toán giá trị dinh dưỡng:
            - Protein: Tính dựa trên loại thực phẩm (thịt ~20-25g/100g, đậu ~8-15g/100g, ngũ cốc ~6-8g/100g)
            - Carb: Tính dựa trên loại thực phẩm (gạo/mì ~70-80g/100g, rau củ ~5-15g/100g)
            - Chất béo: Tính dựa trên loại thực phẩm (dầu ăn 100g/100g, thịt mỡ ~20-30g/100g)
            - Chất xơ: Tính dựa trên loại thực phẩm (rau xanh ~2-4g/100g, ngũ cốc nguyên hạt ~10-15g/100g)

            Đảm bảo sử dụng ngôn ngữ dứt khoát, khẳng định. Nếu hệ thống AI phải đoán, hãy đoán một cách dứt khoát, hợp lý và đầy đủ ngữ nghĩa.
            `;

            // Call the Gemini API
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            // Extract the JSON data from the response
            let foodData;
            try {
                // Find JSON in the response (might be wrapped in markdown code blocks)
                const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
                    text.match(/{[\s\S]*}/); const jsonString = jsonMatch ?
                        (jsonMatch[1] ? jsonMatch[1] : jsonMatch[0]) :
                        text;

                foodData = JSON.parse(jsonString);

                // Đảm bảo tất cả các trường đều có giá trị
                if (!foodData.foodName) foodData.foodName = "Không thể xác định tên món ăn";
                if (!foodData.foodDescription) {
                    foodData.foodDescription = {
                        "Nguồn gốc và ý nghĩa văn hóa": "Không có thông tin",
                        "Hương vị đặc trưng": "Không có thông tin",
                        "Phương pháp chế biến truyền thống": "Không có thông tin"
                    };
                }
                if (!foodData.foodIngredientList) foodData.foodIngredientList = [];
                if (!foodData.foodAdvice) {
                    foodData.foodAdvice = {
                        "Nutrition Summary": "Không có thông tin",
                        "Healthier Suggestions": "Không có thông tin",
                        "Consumption Tips": "Không có thông tin"
                    };
                }
                if (!foodData.foodPreparation) {
                    foodData.foodPreparation = {
                        "Cách làm": ["Không có thông tin về cách chế biến món ăn này"]
                    };
                }
            } catch (error) {
                console.error('Error parsing JSON from Gemini response:', error);
                // If parsing fails, return the raw text
                return {
                    raw: text,
                    error: 'Failed to parse structured data'
                };
            }

            return {
                processed: true,
                imageType: mimeType,
                imageSize: base64Data.length,
                foodData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error analyzing food image with Gemini:', error);
            throw error;
        }
    }

    /**
     * Analyze a food text description and extract detailed information
     * @param {String} textDescription - Text description of food
     * @returns {Object} Detailed food information
     */
    async analyzeFoodText(textDescription) {
        try {
            if (!textDescription) {
                throw new Error('No text description provided');
            }

            console.log('\n=== GEMINI TEXT ANALYSIS START ===');
            console.log('Input text:', textDescription);

            // Prepare the prompt for the model
            const prompt = `
            🧠 Phân tích mô tả món ăn và xuất thông tin chi tiết

            Mô tả món ăn: "${textDescription}"

            Yêu cầu:
            Phân tích mô tả món ăn và trả về các thông tin chi tiết bên dưới. Luôn nói một cách khẳng định và cụ thể. Không sử dụng bất kỳ từ ngữ nào mang tính suy đoán như "có thể là", "có vẻ như", "likely", "possibly"...

            QUAN TRỌNG - VALIDATION:
            - Đảm bảo trích xuất 100% nguyên liệu được đề cập trong văn bản, số lượng ít nhất 4 nguyên liệu 
            - Kiểm tra lại văn bản gốc nhiều lần để không bỏ sót nguyên liệu nào
            - Số lượng thành phần trong "foodIngredientList" phải khớp với số nguyên liệu trong văn bản
            - Mọi nguyên liệu đều phải có đầy đủ thông tin về khối lượng và giá trị dinh dưỡng

            Trả về kết quả theo định dạng JSON với cấu trúc sau:
            {
              "foodName": "Tên món ăn rõ ràng và cụ thể",
              "foodDescription": {
                "Nguồn gốc và ý nghĩa văn hóa": "Mô tả nguồn gốc và văn hóa món ăn (bằng ngôn ngữ dân dã, dễ hiểu)",
                "Hương vị đặc trưng": "Mô tả vị giác nổi bật (giòn, béo, chua, cay, ngọt...)",
                "Phương pháp chế biến truyền thống": "Tóm tắt phương pháp nấu chính (luộc, chiên, nướng...)"
              },
              "foodIngredientList": [
                {
                  "Ingredient Name": "Tên nguyên liệu chính xác như trong văn bản",
                  "Ingredient Amount": "Khối lượng/số lượng chính xác như trong văn bản",
                  "Ingredient Protein": "Lượng protein tính theo khối lượng thực tế",
                  "Ingredient Fat": "Lượng chất béo tính theo khối lượng thực tế",
                  "Ingredient Carb": "Lượng carbohydrate tính theo khối lượng thực tế",
                  "Ingredient Fiber": "Lượng chất xơ tính theo khối lượng thực tế",
                  "Ingredient Description": {
                    "Nguồn gốc & mô tả dân dã": "Mô tả gần gũi, dễ hiểu",
                    "Lợi ích dinh dưỡng": "Các điểm mạnh về sức khỏe",
                    "Cách dùng trong ẩm thực": "Cách thường dùng trong ẩm thực"
                  }
                }
              ],
              "foodAdvice": {
                "Nutrition Summary": "Tóm tắt giá trị dinh dưỡng của món ăn",
                "Healthier Suggestions": "Gợi ý cách làm món ăn lành mạnh hơn",
                "Consumption Tips": "Lời khuyên về khẩu phần, tần suất ăn, món kết hợp"
              },
              "foodPreparation": {
                "Cách làm": [
                  "Bước 1: ...",
                  "Bước 2: ...",
                  "..."
                ]
              }
            }

            Hướng dẫn cụ thể:

            1. 🏷️ Tên món ăn (foodName):
            Cung cấp tên món ăn chính xác theo mô tả. Nếu không có tên cụ thể, đặt tên theo cấu trúc: [Cách chế biến] + [Nguyên liệu chính] (VD: "Xào thịt bò với rau củ").

            2. 📜 Mô tả món ăn (foodDescription):
            Mô tả món ăn với ba nội dung rõ ràng về nguồn gốc văn hóa, hương vị đặc trưng và phương pháp chế biến.

            3. 🧂 Danh sách nguyên liệu (foodIngredientList) - QUAN TRỌNG:
            *** Phải trích xuất 100% nguyên liệu từ văn bản, không bỏ sót bất kỳ nguyên liệu nào ***
            
            Cho mỗi nguyên liệu tìm thấy trong văn bản:
            - Ghi nhận chính xác tên và số lượng/khối lượng như trong văn bản
            - Tính toán giá trị dinh dưỡng dựa trên khối lượng thực tế
            - Bổ sung thông tin về đặc điểm và cách sử dụng

            Tham khảo giá trị dinh dưỡng trên 100g:
            - Thịt đỏ (bò, heo): Protein 20-25g, Chất béo 15-20g
            - Rau xanh: Protein 2-3g, Carb 5-10g, Chất xơ 2-4g
            - Đậu các loại: Protein 8-15g, Carb 20-30g, Chất xơ 5-8g
            - Cơm trắng: Carb 28g, Protein 2.7g, Chất xơ 0.4g (1 chén = 150g)

            4. 🧠 Phân tích dinh dưỡng & lời khuyên (foodAdvice):
            Cung cấp tóm tắt dinh dưỡng, đề xuất cách làm lành mạnh hơn và lời khuyên khi sử dụng.

            5. 🍳 Cách chế biến món ăn (foodPreparation):
            Liệt kê các bước chế biến rõ ràng dựa trên các nguyên liệu đã liệt kê.`;

            // Call the Gemini API
            const result = await this.model.generateContent([prompt]);
            const response = await result.response;
            const text = response.text();

            console.log('\nRaw Gemini Response:', text);

            // Extract the JSON data from the response
            let foodData;
            try {
                // Find JSON in the response (might be wrapped in markdown code blocks)
                const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
                    text.match(/{[\s\S]*}/);
                const jsonString = jsonMatch ?
                    (jsonMatch[1] ? jsonMatch[1] : jsonMatch[0]) :
                    text;

                foodData = JSON.parse(jsonString);
                console.log('\nParsed Food Data:', JSON.stringify(foodData, null, 2));
                console.log('\nNumber of ingredients:', foodData.foodIngredientList?.length || 0);
                console.log('=== GEMINI TEXT ANALYSIS END ===\n');

                // Đảm bảo tất cả các trường đều có giá trị
                if (!foodData.foodName) foodData.foodName = "Không thể xác định tên món ăn";
                if (!foodData.foodDescription) {
                    foodData.foodDescription = {
                        "Nguồn gốc và ý nghĩa văn hóa": "Không có thông tin",
                        "Hương vị đặc trưng": "Không có thông tin",
                        "Phương pháp chế biến truyền thống": "Không có thông tin"
                    };
                }
                if (!foodData.foodIngredientList) foodData.foodIngredientList = [];
                if (!foodData.foodAdvice) {
                    foodData.foodAdvice = {
                        "Nutrition Summary": "Không có thông tin",
                        "Healthier Suggestions": "Không có thông tin",
                        "Consumption Tips": "Không có thông tin"
                    };
                }
                if (!foodData.foodPreparation) {
                    foodData.foodPreparation = {
                        "Cách làm": ["Không có thông tin về cách chế biến món ăn này"]
                    };
                }
            } catch (error) {
                console.error('Error parsing JSON from Gemini response:', error);
                // If parsing fails, return the raw text
                return {
                    raw: text,
                    error: 'Failed to parse structured data'
                };
            }

            return {
                processed: true,
                foodData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error analyzing food text with Gemini:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const geminiService = new GeminiService();

module.exports = geminiService;
