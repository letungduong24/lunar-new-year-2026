import { GoogleGenAI } from '@google/genai';
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "" });

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: "Vui lòng cấu hình GEMINI_API_KEY trong file .env.local" }, { status: 500 });
        }

        const response = await ai.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: `Hãy viết một lời chúc Tết Nguyên Đán 2026 (năm Bính Ngọ) dựa trên ý tưởng này: "${prompt}". 
      Yêu cầu: 
      - Lời chúc mang phong cách truyền thống, ấm áp, sang trọng.
      - Độ dài lời chúc PHẢI dưới 160 ký tự.
      - Chỉ trả về duy nhất nội dung lời chúc, không thêm lời dẫn hay kết luận.`,
        });


        return NextResponse.json({ text: response.text });
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Không thể tạo lời chúc lúc này. Vui lòng thử lại sau." }, { status: 500 });
    }
}
