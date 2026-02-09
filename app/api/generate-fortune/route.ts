import { GoogleGenAI } from '@google/genai';
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "" });

export async function POST(req: Request) {
    try {
        const { name, birthDate } = await req.json();

        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: "Vui lòng cấu hình GEMINI_API_KEY trong file .env.local" }, { status: 500 });
        }

        const response = await ai.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: `Hãy đóng vai một thầy đồ xem quẻ Tết xưa. Hãy gieo một quẻ may mắn cho năm Bính Ngọ 2026 dựa trên thông tin: Tên: "${name}", Ngày sinh: "${birthDate || "Không rõ"}". 
      Yêu cầu:
      - Ngôn ngữ: Trang trọng, hán việt nhẹ nhàng, pha chút chất thơ nhưng vẫn dễ hiểu.
      - Nội dung: Dự đoán về sự nghiệp, tình cảm, hoặc sức khỏe một cách tích cực, mang tính khích lệ.
      - Cấu trúc: 
        1. Tên quẻ (Ví dụ: Mã Đóa Thành Công, Vạn Sự Hanh Thông...)
        2. Lời thơ (4 câu thơ lục bát hoặc thất ngôn)
        3. Luận giải ngắn gọn (2-3 câu).
      - Độ dài tổng cộng: Dưới 160 ký tự để vừa khung ảnh.
      - KHÔNG sử dụng định dạng Markdown (như dấu **).
      - Chỉ trả về nội dung quẻ, không thêm lời dẫn.`,

        });

        return NextResponse.json({ text: response.text });
    } catch (error: any) {
        console.error("AI Fortune Error:", error);
        return NextResponse.json({ error: "Thầy đang bận gieo quẻ khác, vui lòng thử lại sau." }, { status: 500 });
    }
}
