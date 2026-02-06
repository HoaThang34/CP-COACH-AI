
class PROMPTS:
    @staticmethod
    def generate_problem_instruction(topic: str, difficulty: str, custom_request: str = None) -> str:
        """Generates the instruction block for creating a new problem."""
        if custom_request and custom_request.strip():
            return f"""
    YÊU CẦU ĐẶC BIỆT TỪ NGƯỜI DÙNG: "{(custom_request)}"
    
    Hãy phân tích yêu cầu trên để tạo ra một đề bài phù hợp. 
    - Nếu người dùng mô tả một tình huống, hãy biến nó thành bài toán tin học.
    - Nếu người dùng yêu cầu thuật toán cụ thể, hãy tạo bài toán sử dụng thuật toán đó.
    - Bỏ qua tham số 'Chủ đề' gốc nếu yêu cầu của người dùng đã rõ ràng về chủ đề khác.
    - Cố gắng giữ 'Độ khó' ở mức: {difficulty} (trừ khi người dùng yêu cầu khác).
    """
        return f"""
    Tham số sinh đề:
    - Chủ đề: {topic}
    - Độ khó: {difficulty}
    """

    @staticmethod
    def generate_problem(user_instruction: str) -> str:
        """Main prompt for the Problem Generator."""
        return f"""
    Bạn là AI huấn luyện viên chuyên luyện thi Học sinh giỏi Tin học.
    Hãy sinh một đề bài lập trình thi đấu mới.
    
    {user_instruction}
    
    Yêu cầu chung:
    - Đề bài phải rõ ràng, chuẩn format HSG (Competitive Programming).
    - Có ý tưởng thuật toán cụ thể.
    - KHÔNG dùng emoji.
    - Tự động suy luận lại 'topic' và 'difficulty' thực tế của bài toán bạn vừa tạo và điền vào JSON.
    
    Trả về JSON khớp với schema.
    """

    generate_problem_system = "Bạn là một giám khảo HSG Tin học nghiêm khắc. Hãy tạo đề bài chất lượng cao."

    @staticmethod
    def analyze_solution(problem_title, problem_desc, problem_constraints, user_code, language) -> str:
        """Main prompt for analyzing user solution."""
        return f"""
    ĐỀ BÀI:
    {problem_title}
    {problem_desc}
    Constraints: {problem_constraints}

    BÀI LÀM CỦA THÍ SINH ({language}):
    {user_code}

    NHIỆM VỤ:
    Đóng vai giám khảo HSG Tin học, phân tích code trên (không chạy test case).
    
    1. Xác định ý tưởng thuật toán.
    2. Đánh giá độ đúng đắn (Logic, Edge cases). Nếu sai, phải chỉ ra input nào sẽ làm code sai.
    3. Phân tích độ phức tạp (Time/Space) so với Constraints.
    4. Đưa ra nhận xét và gợi ý.

    QUAN TRỌNG VỀ FORMAT MARKDOWN:
    - Mọi công thức toán học PHẢI dùng cú pháp LaTeX kẹp giữa dấu $. Ví dụ: $O(N^2)$, $10^{{18}}$, $dp[i]$.
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
    """

    @staticmethod
    def request_hint(problem_title, user_code, current_feedback) -> str:
        """Prompt for requesting a hint."""
        return f"""
    ĐỀ BÀI: {problem_title}
    CODE HIỆN TẠI: {user_code}
    NHẬN XÉT TRƯỚC ĐÓ: {current_feedback}
    
    Người dùng đang bế tắc và xin gợi ý. Hãy đưa ra một gợi ý nhỏ (Hint) về hướng đi đúng hoặc cách tối ưu, không đưa lời giải đầy đủ.
    Phong cách: Gợi mở tư duy.
    """

    @staticmethod
    def generate_solution(problem_title, problem_desc, problem_constraints, language) -> str:
        """Prompt for generating the full solution."""
        return f"""
    ĐỀ BÀI: 
    {problem_title}
    {problem_desc}
    Constraints: {problem_constraints}
    
    Ngôn ngữ: {language}
    
    Học sinh đang bí và cần xem lời giải mẫu.
    Hãy tạo ra một lời giải chi tiết gồm:
    1. Phân tích thuật toán (giải thích cách tiếp cận, công thức quy hoạch động nếu có, v.v.).
    2. Độ phức tạp.
    3. Code mẫu chuẩn mực (Clean code, comment đầy đủ).

    QUAN TRỌNG: 
    - Dùng cú pháp LaTeX chuẩn ($...$) cho công thức toán. 
    - Định dạng Markdown đẹp.
    
    Trả về JSON.
    """

    @staticmethod
    def chat_system_instruction(current_context: str = None) -> str:
        """System instruction for the Chatbot."""
        instruction = "Bạn là Trợ lý học tập môn Tin học, chuyên giải đáp thắc mắc về thuật toán, cấu trúc dữ liệu và lập trình. Bạn thân thiện, kiên nhẫn và giải thích dễ hiểu. Sử dụng LaTeX ($...$) cho công thức toán."
        if current_context:
            instruction += f"\n\nHọc sinh đang làm bài tập sau:\n{current_context}"
        return instruction
