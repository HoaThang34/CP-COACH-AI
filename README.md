# CP Coach AI 🧠

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

<a name="english"></a>
## 🇬🇧 English

**CP Coach AI** is an advanced, AI-powered training platform designed for competitive programmers. Unlike traditional judges that rely on hidden test cases, CP Coach AI uses Google's Gemini models to generate unique problems, analyze algorithmic logic statically, and provide intelligent feedback, hints, and model solutions.

It is designed to help students prepare for competitions like **HSG (National Student Olympiad)**, **ICPC**, and **Codeforces** by focusing on algorithmic thinking, complexity analysis, and code quality.

### 🚀 Key Features

- **Dynamic Problem Generation**:
  - Instantly generate problems based on specific topics (e.g., DP, Graphs, Greedy) and difficulty levels.
  - **Custom Mode**: Describe a scenario or specific algorithm requirements to generate a tailored problem.
  - **History**: Automatically saves generated problems for review later.

- **AI "Static Analysis" Judge**:
  - Evaluates code logic without running test cases.
  - Detects logic errors, edge cases, and incorrect complexity ($O(N)$ vs $O(N^2)$).
  - Provides detailed feedback formatted in Markdown with LaTeX math support.

- **Smart Assistance**:
  - **Hints**: Request nudges in the right direction without revealing the full answer.
  - **Model Solutions**: Generate complete reference solutions with detailed explanations and complexity proofs.
  - **Context-Aware Chatbot**: A floating tutor that knows the current problem context and can answer specific questions.

- **Developer Experience**:
  - **LaTeX Support**: Renders mathematical formulas beautifully using KaTeX.
  - **Print Friendly**: Optimized CSS for printing problems or saving them as PDFs.
  - **Prompt Engineering**: All AI prompts are centralized for easy tuning.

### 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Models Used**:
  - `gemini-3-flash-preview` (High speed: Problem generation, Chat, Hints)
  - `gemini-3-pro-preview` (High reasoning: Code analysis, Solution generation)
- **Rendering**: `react-markdown`, `rehype-katex` (Math rendering)
- **Icons**: Lucide React

### 📂 Project Structure

```text
.
├── src/
│   ├── components/      # UI Components
│   │   ├── ...
│   ├── services/        # Logic & API layer
│   │   ├── ...
│   ├── types.ts         # TypeScript interfaces
│   ├── App.tsx          # Main application controller
│   └── index.tsx        # React Entry point
├── PROMPTS.md           # Documentation for AI Prompts
└── index.html           # Web Entry point
```

### ⚡ Installation & Setup

1.  **Prerequisites**:
    - Node.js (v18+)
    - A valid API Key from [Google AI Studio](https://aistudio.google.com/).

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure API Key**:
    The application expects `process.env.API_KEY`. Create a `.env` file (depending on your bundler config) or set the environment variable.
    ```env
    API_KEY=your_actual_api_key_here
    ```

4.  **Run the Application**:
    ```bash
    npm start
    # or
    npm run dev
    ```

### 📖 Usage Guide

1.  **Select a Topic**: Choose from standard topics (Arrays, DP, Graphs) or use "Custom Mode".
2.  **Set Difficulty**: Choose from Easy up to National Student Olympiad level.
3.  **Generate**: Click "Sinh đề bài mới" (Generate New Problem).
4.  **Solve**: Write your code in the editor panel (supports C++, Python, Java, Pascal).
5.  **Submit**: Click "Nộp bài & Chấm" (Submit & Judge). The AI Judge will analyze your code.
6.  **Get Help**: Use the Chat widget or "Gợi ý" (Hint) button if stuck.

### 🔧 Customizing AI Prompts

To ensure maintainability, all prompt logic is extracted into `services/prompts.ts`. A detailed explanation of the prompt engineering strategy can be found in **[PROMPTS.md](./PROMPTS.md)**.

### 🤝 Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a Pull Request.

---

<a name="tiếng-việt"></a>
## 🇻🇳 Tiếng Việt

**CP Coach AI** là một nền tảng luyện tập lập trình thi đấu tiên tiến được hỗ trợ bởi trí tuệ nhân tạo (AI). Khác với các hệ thống chấm bài truyền thống (OJ) dựa trên các bộ test case ẩn, CP Coach AI sử dụng các mô hình Google Gemini để tạo ra các đề bài độc đáo, phân tích tư duy thuật toán tĩnh và cung cấp phản hồi thông minh, gợi ý cũng như lời giải mẫu.

Dự án được thiết kế để giúp học sinh chuẩn bị cho các kỳ thi như **HSG (Học sinh giỏi Quốc gia)**, **ICPC**, và **Codeforces** bằng cách tập trung vào tư duy thuật toán, phân tích độ phức tạp và chất lượng mã nguồn.

### 🚀 Tính Năng Chính

- **Tạo Đề Bài Động**:
  - Tạo đề bài tức thì dựa trên các chủ đề cụ thể (Quy hoạch động, Đồ thị, Tham lam...) và độ khó mong muốn.
  - **Chế độ Tùy chỉnh**: Mô tả một tình huống thực tế hoặc yêu cầu thuật toán cụ thể để tạo ra đề bài riêng biệt.
  - **Lịch sử**: Tự động lưu lại các đề bài đã tạo để xem lại sau.

- **AI Chấm Bài (Phân Tích Tĩnh)**:
  - Đánh giá logic của code mà không cần chạy test case.
  - Phát hiện lỗi logic, các trường hợp biên (edge cases) và sai lệch về độ phức tạp (ví dụ: dùng $O(N^2)$ thay vì $O(N)$).
  - Cung cấp phản hồi chi tiết định dạng Markdown với hỗ trợ công thức toán học LaTeX.

- **Hỗ Trợ Thông Minh**:
  - **Gợi ý (Hint)**: Yêu cầu gợi ý hướng đi đúng mà không làm lộ lời giải hoàn chỉnh.
  - **Lời Giải Mẫu**: Tạo lời giải tham khảo hoàn chỉnh với giải thích chi tiết và chứng minh độ phức tạp.
  - **Chatbot Trợ Giảng**: Một trợ lý ảo hiểu ngữ cảnh bài toán hiện tại để giải đáp thắc mắc cụ thể.

- **Trải Nghiệm Phát Triển**:
  - **Hỗ trợ LaTeX**: Hiển thị công thức toán học đẹp mắt bằng KaTeX.
  - **Tối ưu In ấn**: Giao diện được tối ưu để in đề bài hoặc lưu dưới dạng PDF.
  - **Quản lý Prompt**: Tất cả các câu lệnh (prompts) cho AI được tập trung quản lý để dễ dàng tinh chỉnh.

### 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Tích hợp AI**: Google GenAI SDK (`@google/genai`)
- **Mô hình**:
  - `gemini-3-flash-preview` (Tốc độ cao: Tạo đề, Chat, Gợi ý)
  - `gemini-3-pro-preview` (Tư duy sâu: Phân tích code, Tạo lời giải)
- **Hiển thị**: `react-markdown`, `rehype-katex` (Render toán học)
- **Icons**: Lucide React

### 📂 Cấu Trúc Dự Án

```text
.
├── src/
│   ├── components/      # Các thành phần giao diện (UI)
│   │   ├── ...
│   ├── services/        # Logic xử lý & API
│   │   ├── ...
│   ├── types.ts         # Định nghĩa kiểu dữ liệu TypeScript
│   ├── App.tsx          # Component chính điều phối ứng dụng
│   └── index.tsx        # Điểm khởi chạy React
├── PROMPTS.md           # Tài liệu chi tiết về AI Prompts
└── index.html           # Điểm khởi chạy Web
```

### ⚡ Cài Đặt & Thiết Lập

1.  **Yêu cầu**:
    - Node.js (v18 trở lên).
    - API Key hợp lệ từ [Google AI Studio](https://aistudio.google.com/).

2.  **Cài đặt thư viện**:
    ```bash
    npm install
    ```

3.  **Cấu hình API Key**:
    Ứng dụng yêu cầu biến môi trường `process.env.API_KEY`. Hãy tạo file `.env` (tùy thuộc vào bundler của bạn) hoặc thiết lập biến môi trường.
    ```env
    API_KEY=your_actual_api_key_here
    ```

4.  **Chạy ứng dụng**:
    ```bash
    npm start
    # hoặc
    npm run dev
    ```

### 📖 Hướng Dẫn Sử Dụng

1.  **Chọn Chủ Đề**: Chọn từ các chủ đề có sẵn (Mảng, Quy hoạch động, Đồ thị...) hoặc dùng "Tự Chọn".
2.  **Chọn Độ Khó**: Từ Dễ đến HSG Quốc gia.
3.  **Tạo Đề**: Nhấn nút "Sinh đề bài mới". AI sẽ tạo đề bài chuẩn với ví dụ Input/Output.
4.  **Làm Bài**: Viết code giải vào khung soạn thảo (hỗ trợ C++, Python, Java, Pascal).
5.  **Nộp Bài**: Nhấn "Nộp bài & Chấm". AI sẽ phân tích code và đưa ra kết luận (Đúng, Sai hướng, v.v.).
6.  **Trợ Giúp**: Sử dụng khung Chat hoặc nút "Gợi ý" nếu gặp khó khăn.

### 🔧 Tùy Chỉnh AI Prompts

Để đảm bảo khả năng bảo trì, tất cả logic prompts được tách biệt trong `services/prompts.ts`.
Giải thích chi tiết về chiến lược prompt engineering có thể xem tại **[PROMPTS.md](./PROMPTS.md)**.

### 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Vui lòng fork repository, tạo branch tính năng mới và gửi Pull Request.

---

## 📄 License

This project is open-source and available for educational purposes. / Dự án này là mã nguồn mở và được sử dụng cho mục đích giáo dục.
