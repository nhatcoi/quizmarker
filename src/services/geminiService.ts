const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL;

if (!GEMINI_API_KEY || !GEMINI_API_URL) {
  throw new Error('Vui lòng cấu hình REACT_APP_GEMINI_API_KEY và REACT_APP_GEMINI_API_URL trong file .env');
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const formatTextWithGemini = async (inputText: string): Promise<string> => {
  const prompt = `
Bạn là một AI chuyên format lại câu hỏi quiz thành định dạng chuẩn. Hãy format lại text sau theo các quy tắc:

1. Mỗi câu hỏi giữ nguyên nội dung
2. Các lựa chọn phải được đánh số A., B., C., D., E., ... (thêm chữ cái và dấu chấm vào đầu)
3. Dòng đáp án phải có định dạng "Đáp án đúng: [chữ cái]" (thay số thành chữ cái tương ứng)
4. Nếu có nhiều đáp án đúng, cách nhau bằng dấu phẩy và khoảng trắng
5. Giữ nguyên tất cả nội dung câu hỏi và lựa chọn, chỉ thay đổi format

Ví dụ chuyển đổi:
Input:
"Câu hỏi gì đó?
Lựa chọn 1
Lựa chọn 2  
Lựa chọn 3
câu đúng: 1, 3"

Output:
"Câu hỏi gì đó?
A. Lựa chọn 1
B. Lựa chọn 2
C. Lựa chọn 3
Đáp án đúng: A, C"

Text cần format:
${inputText}

Chỉ trả về text đã được format, không thêm giải thích gì khác:
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Không nhận được phản hồi từ Gemini AI');
    }

    const formattedText = data.candidates[0].content.parts[0].text.trim();
    return formattedText;

  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    throw new Error('Không thể format text. Vui lòng thử lại sau.');
  }
}; 