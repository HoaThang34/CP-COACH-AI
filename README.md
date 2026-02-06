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
- **AI "Static Analysis" Judge**:
  - Evaluates code logic without running test cases.
  - Detects logic errors, edge cases, and incorrect complexity ($O(N)$ vs $O(N^2)$).
- **Smart Assistance**:
  - **Hints**: Request nudges in the right direction without revealing the full answer.
  - **Model Solutions**: Generate complete reference solutions with detailed explanations and complexity proofs.
  - **Context-Aware Chatbot**: A floating tutor that knows the current problem context and can answer specific questions.
- **Developer Experience**:
  - **1-Click Startup**: Use `run_app.bat` for instant setup and execution.
  - **LaTeX Support**: Renders mathematical formulas beautifully using KaTeX.
  - **Print Friendly**: Optimized CSS for printing problems.

### 🛠️ Tech Stack

- **Frontend**: Vanilla HTML, CSS (Tailwind), JavaScript
- **Backend**: Python (Flask)
- **AI Integration**: Google GenAI SDK (`google-generativeai`)
- **Deployment**: Optimized for Vercel (Python Runtime)

### 📂 Project Structure

```text
.
├── api/                 # Python Backend (Flask)
│   ├── services/        # AI Service Logic
│   ├── prompts.py       # Prompt Templates
│   └── index.py         # App Entry Point
├── public/              # Static Frontend
│   ├── css/             # Styles
│   ├── js/              # Application Logic
│   └── index.html       # Main HTML File
├── requirements.txt     # Python Dependencies
├── run_app.bat          # 1-Click Startup for Windows
├── vercel.json          # Deployment Config
└── README.md
```

### ⚡ Installation & Setup

1.  **Prerequisites**:
    - Python 3.9+
    - A valid API Key from [Google AI Studio](https://aistudio.google.com/).

2.  **Windows (Recommend)**:
    - Just double-click **`run_app.bat`**. It will install dependencies and start the app.

3.  **Manual Start**:
    ```bash
    pip install -r requirements.txt
    python -m api.index
    ```

4.  **Configure API Key**:
    Set the `GEMINI_API_KEY` environment variable or create a `.env` file.

### 📖 Usage Guide

1.  **Select a Topic**: Choose from standard topics or use "Custom Mode".
2.  **Set Difficulty**: Choose from Easy up to National Student Olympiad level.
3.  **Generate**: Click "Sinh đề bài mới" (Generate New Problem).
4.  **Solve**: Write your code in the editor panel.
5.  **Submit**: Click "Nộp bài & Chấm" (Submit & Judge).

---

<a name="tiếng-việt"></a>
## 🇻🇳 Tiếng Việt

**CP Coach AI** là một nền tảng luyện tập lập trình thi đấu tiên tiến được hỗ trợ bởi trí tuệ nhân tạo (AI). Khác với các hệ thống chấm bài truyền thống (OJ) dựa trên các bộ test case ẩn, CP Coach AI sử dụng các mô hình Google Gemini để tạo ra các đề bài độc đáo, phân tích tư duy thuật toán tĩnh và cung cấp phản hồi thông minh, gợi ý cũng như lời giải mẫu.

### 🚀 Tính Năng Chính

- **Tạo Đề Bài Động**:
  - Tạo đề bài tức thì dựa trên các chủ đề (Quy hoạch động, Đồ thị, Tham lam...) và độ khó mong muốn.
  - **Chế độ Tùy chỉnh**: Nhập yêu cầu cụ thể để AI sinh đề theo ý muốn.
- **AI Chấm Bài (Phân Tích Tĩnh)**:
  - Đánh giá logic của code mà không cần chạy test case.
  - Phát hiện lỗi logic, các trường hợp biên và sai lệch về độ phức tạp.
- **Hỗ Trợ Thông Minh**:
  - **Gợi ý (Hint)**: Gợi mở hướng đi mà không làm lộ lời giải hoàn chỉnh.
  - **Lời Giải Mẫu**: Tạo lời giải tham khảo kèm giải thích chi tiết.
  - **Chatbot Trợ Giảng**: Trợ lý ảo hiểu ngữ cảnh bài toán đang làm.
- **Trải Nghiệm Tiện Lợi**:
  - **Khởi động 1-click**: Sử dụng `run_app.bat` để tự động hóa toàn bộ quy trình chạy app.
  - **Hỗ trợ LaTeX**: Hiển thị công thức toán học đẹp mắt.

### 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Vanilla HTML, CSS (Tailwind), JavaScript
- **Backend**: Python (Flask)
- **Tích hợp AI**: Google GenAI SDK (`google-generativeai`)
- **Triển khai**: Tối ưu cho Vercel (Python Runtime)

### 📂 Cấu Trúc Dự Án

```text
.
├── api/                 # Backend Python (Flask)
│   ├── services/        # Logic xử lý AI
│   ├── prompts.py       # Mẫu câu lệnh AI
│   └── index.py         # Điểm khởi chạy API
├── public/              # Frontend Tĩnh
│   ├── css/             # Giao diện
│   ├── js/              # Logic ứng dụng
│   └── index.html       # Trang chính
├── requirements.txt     # Danh sách thư viện Python
├── run_app.bat          # File chạy nhanh trên Windows
├── vercel.json          # Cấu hình deployment
└── README.md
```

### ⚡ Cài Đặt & Thiết Lập

1.  **Yêu cầu**:
    - Python 3.9+ 
    - API Key từ [Google AI Studio](https://aistudio.google.com/).

2.  **Cách nhanh nhất (Windows)**:
    - Click đúp vào file **`run_app.bat`**. Chương trình sẽ tự cài thư viện và mở trình duyệt.

3.  **Cách thủ công**:
    ```bash
    pip install -r requirements.txt
    python -m api.index
    ```

4.  **Cấu hình API Key**:
    Thiết lập biến môi trường `GEMINI_API_KEY` hoặc tạo file `.env`.

### 📖 Hướng Dẫn Sử Dụng

1.  **Chọn Chủ Đề**: Chọn từ danh sách có sẵn hoặc dùng "Tự Chọn".
2.  **Chọn Độ Khó**: Từ Dễ đến HSG Quốc gia.
3.  **Tạo Đề**: Nhấn nút "Sinh đề bài mới".
4.  **Làm Bài**: Viết code giải vào khung soạn thảo.
5.  **Nộp Bài**: Nhấn "Nộp bài & Chấm" để AI đánh giá.

---

## 📄 License

This project is open-source and available for educational purposes.
