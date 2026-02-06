import { Difficulty, Problem } from '../types';

export const PROMPTS = {
  /**
   * Generates the instruction block for creating a new problem.
   */
  generateProblemInstruction: (topic: string, difficulty: Difficulty, customRequest?: string) => {
    if (customRequest && customRequest.trim() !== "") {
      return `
    YÊU CẦU ĐẶC BIỆT TỪ NGƯỜI DÙNG: "${customRequest}"
    
    Hãy phân tích yêu cầu trên để tạo ra một đề bài phù hợp. 
    - Nếu người dùng mô tả một tình huống, hãy biến nó thành bài toán tin học.
    - Nếu người dùng yêu cầu thuật toán cụ thể, hãy tạo bài toán sử dụng thuật toán đó.
    - Bỏ qua tham số 'Chủ đề' gốc nếu yêu cầu của người dùng đã rõ ràng về chủ đề khác.
    - Cố gắng giữ 'Độ khó' ở mức: ${difficulty} (trừ khi người dùng yêu cầu khác).
    `;
    }
    return `
    Tham số sinh đề:
    - Chủ đề: ${topic}
    - Độ khó: ${difficulty}
    `;
  },

  /**
   * Main prompt for the Problem Generator.
   */
  generateProblem: (userInstruction: string) => `
    Bạn là AI huấn luyện viên chuyên luyện thi Học sinh giỏi Tin học.
    Hãy sinh một đề bài lập trình thi đấu mới.
    
    ${userInstruction}
    
    Yêu cầu chung:
    - Đề bài phải rõ ràng, chuẩn format HSG (Competitive Programming).
    - Có ý tưởng thuật toán cụ thể.
    - KHÔNG dùng emoji.
    - Tự động suy luận lại 'topic' và 'difficulty' thực tế của bài toán bạn vừa tạo và điền vào JSON.
    
    Trả về JSON khớp với schema.
  `,

  generateProblemSystem: "Bạn là một giám khảo HSG Tin học nghiêm khắc. Hãy tạo đề bài chất lượng cao.",

  /**
   * Main prompt for analyzing user solution.
   */
  analyzeSolution: (problem: Problem, userCode: string, language: string) => `
    ĐỀ BÀI:
    ${problem.title}
    ${problem.description}
    Constraints: ${problem.constraints}

    BÀI LÀM CỦA THÍ SINH (${language}):
    ${userCode}

    NHIỆM VỤ:
    Đóng vai giám khảo HSG Tin học, phân tích code trên (không chạy test case).
    
    1. Xác định ý tưởng thuật toán.
    2. Đánh giá độ đúng đắn (Logic, Edge cases). Nếu sai, phải chỉ ra input nào sẽ làm code sai.
    3. Phân tích độ phức tạp (Time/Space) so với Constraints.
    4. Đưa ra nhận xét và gợi ý.

    QUAN TRỌNG VỀ FORMAT MARKDOWN:
    - Mọi công thức toán học PHẢI dùng cú pháp LaTeX kẹp giữa dấu $. Ví dụ: $O(N^2)$, $10^{18}$, $dp[i]$.
    - KHÔNG dùng \\( ... \\) hoặc \\[ ... \\].
    - In đậm các từ khóa quan trọng.

    PHÂN CẤP ĐÁNH GIÁ (Chọn 1 trong 4 để điền vào VERDICT_CODE):
    - SAI_HUONG (Sai ý tưởng hoàn toàn hoặc thuật toán không chạy được)
    - THIEU_SOT (Đúng hướng nhưng sai logic nhỏ, thiếu trường hợp biên, hoặc TLE/MLE)
    - DUNG (Đúng thuật toán, pass được constraints)
    - XUAT_SAC (Tư duy vượt trội, code đẹp, tối ưu nhất)

    OUTPUT FORMAT:
    Dòng 1: [VERDICT_CODE]
    Các dòng sau (Markdown):
    
    ### 1. Kết luận
    - **Trạng thái**: [Ghi rõ ĐÚNG hoặc SAI tại đây]
    - **Nguyên nhân sai**: [Nếu sai, ghi ngắn gọn lý do tại đây. Nếu đúng, ghi "Đạt yêu cầu"]

    ### 2. Phân tích kỹ thuật
    - **Thuật toán sử dụng**: ...
    - **Độ phức tạp**: Thời gian $O(...)$, Bộ nhớ $O(...)$
    - **Đánh giá Constraints**: [Phân tích xem độ phức tạp này có thỏa mãn giới hạn thời gian không]

    ### 3. Chi tiết & Góp ý
    - [Chỉ ra lỗi sai cụ thể nếu có]
    - [Nhận xét về phong cách code]
    - [Gợi ý cải thiện]
  `,

  /**
   * Prompt for requesting a hint.
   */
  requestHint: (problem: Problem, userCode: string, currentFeedback: string) => `
    ĐỀ BÀI: ${problem.title}
    CODE HIỆN TẠI: ${userCode}
    NHẬN XÉT TRƯỚC ĐÓ: ${currentFeedback}
    
    Người dùng đang bế tắc và xin gợi ý. Hãy đưa ra một gợi ý nhỏ (Hint) về hướng đi đúng hoặc cách tối ưu, không đưa lời giải đầy đủ.
    Phong cách: Gợi mở tư duy.
  `,

  /**
   * Prompt for generating the full solution.
   */
  generateSolution: (problem: Problem, language: string) => `
    ĐỀ BÀI: 
    ${problem.title}
    ${problem.description}
    Constraints: ${problem.constraints}
    
    Ngôn ngữ: ${language}
    
    Học sinh đang bí và cần xem lời giải mẫu.
    Hãy tạo ra một lời giải chi tiết gồm:
    1. Phân tích thuật toán (giải thích cách tiếp cận, công thức quy hoạch động nếu có, v.v.).
    2. Độ phức tạp.
    3. Code mẫu chuẩn mực (Clean code, comment đầy đủ).

    QUAN TRỌNG: 
    - Dùng cú pháp LaTeX chuẩn ($...$) cho công thức toán. 
    - Định dạng Markdown đẹp.
    
    Trả về JSON.
  `,

  /**
   * System instruction for the Chatbot.
   */
  chatSystemInstruction: (currentContext?: string) => {
    let instruction = "Bạn là Trợ lý học tập môn Tin học, chuyên giải đáp thắc mắc về thuật toán, cấu trúc dữ liệu và lập trình. Bạn thân thiện, kiên nhẫn và giải thích dễ hiểu. Sử dụng LaTeX ($...$) cho công thức toán.";
    if (currentContext) {
      instruction += `\n\nHọc sinh đang làm bài tập sau:\n${currentContext}`;
    }
    return instruction;
  }
};
