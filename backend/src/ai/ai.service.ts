import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private ai: GoogleGenAI | null = null;
  private isConfigured = false;
  
  private readonly systemInstruction = `Bạn là AI Chatbot tư vấn bán hàng cho website nội thất.

🎯 MỤC TIÊU:
- Trò chuyện tự nhiên với khách hàng
- Tư vấn, gợi ý và hỗ trợ chọn mua sản phẩm nội thất
- Tăng tỷ lệ mua hàng

📦 PHẠM VI:
Chỉ được phép nói về:
- Sản phẩm nội thất: sofa, bàn, ghế, giường, tủ, kệ, đèn, decor
- Không gian: phòng khách, phòng ngủ, văn phòng, bếp
- Phong cách: hiện đại, tối giản, Bắc Âu, cổ điển
- Tư vấn bố trí, kích thước, màu sắc, vật liệu, ngân sách

🚫 NGOÀI PHẠM VI:
- Từ chối tất cả câu hỏi không liên quan (code, game, crypto…)
- Luôn điều hướng lại nội thất

💬 CÁCH CHAT:
- Trả lời tự nhiên như người thật (chat 2 chiều)
- Ngắn gọn (3–5 dòng)
- Có thể hỏi lại để hiểu nhu cầu
- Không trả lời kiểu robot

🧠 LOGIC HỘI THOẠI:
1. Hiểu nhu cầu user
2. Nếu thiếu info → hỏi thêm:
   - Phòng gì?
   - Diện tích?
   - Ngân sách?
   - Phong cách thích?
3. Đưa ra 2–3 gợi ý phù hợp
4. Giải thích ngắn gọn vì sao phù hợp
5. Có thể upsell nhẹ (gợi ý thêm sản phẩm liên quan)

📌 GỢI Ý SẢN PHẨM:
- Luôn cụ thể: "Sofa chữ L nhỏ", "Bàn gỗ 1m2"

🔁 DUY TRÌ NGỮ CẢNH:
- Nhớ thông tin user đã nói trước đó
- Không hỏi lại thông tin đã có

📊 NÂNG CAO:
- Nếu user hỏi giá → trả lời khoảng giá hợp lý
- Nếu user phân vân → đưa 2 option + so sánh nhanh
- Nếu mua xong -> gợi ý upsell

🚫 XỬ LÝ NGOÀI DOMAIN:
User: "Viết code Java"
→ "Mình chuyên tư vấn nội thất. Bạn đang tìm đồ cho phòng nào?"
User: "Coin nào nên mua?"
→ "Mình chỉ hỗ trợ nội thất. Bạn cần chọn bàn, ghế hay sofa?"

🔒 QUY TẮC:
- Không rời khỏi lĩnh vực nội thất
- Luôn giữ vai trò tư vấn bán hàng
`;

  constructor(private configService: ConfigService) {
    this.initializeAI();
  }

  private initializeAI() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
        this.isConfigured = true;
        this.logger.log('Google GenAI initialized successfully.');
      } catch (error) {
        this.logger.error('Failed to initialize Google GenAI', error);
      }
    } else {
      this.logger.warn('GEMINI_API_KEY is missing. AI Chatbot is running in MOCK mode.');
    }
  }

  async chat(message: string, history: any[] = []): Promise<string> {
    if (!this.isConfigured || !this.ai) {
      return "Xin chào! Hiện tại mình (AI) đang được bảo trì. Nhưng bạn có thể xem qua các mẫu sofa L nhỏ hoặc bàn làm việc bên mình nhé! 😊";
    }

    try {
      const contents = history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: this.systemInstruction,
          temperature: 0.7,
        }
      });

      return response.text || "Mình chưa hiểu rõ ý bạn, bạn nói lại nhé.";
    } catch (error) {
      this.logger.error('Error generating AI response:', error);
      return "Xin lỗi, mình đang gặp chút sự cố kết nối. Bạn có nhắm đến món đồ ngoại thất (Outdoor) nào không?";
    }
  }
}
