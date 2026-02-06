# CP Coach AI 🧠

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

<a name="english"></a>
## 🇬🇧 English

**CP Coach AI** is a next-generation training platform for competitive programmers, powered by **local LLMs via Ollama**. It provides **instant, test-case-free evaluation** through static analysis, along with intelligent feedback and personalized learning paths, all running locally on your machine for maximum privacy and zero cost.

It is designed to help students prepare for competitions like **HSG (National Student Olympiad)**, **ICPC**, and **Codeforces** by focusing on algorithmic thinking, complexity analysis, and code quality.

### 🌟 What's New
- **Local AI Power**: Runs completely offline using Ollama (supporting models like Qwen 2.5, Llama 3, Mistral).
- **Premium UI & Animations**: Smooth entrance animations, glassmorphism design, and interactive elements.
- **User Authentication**: Secure login/registration system to track your progress.
- **Real-time Chat Assistant**: A context-aware AI tutor that helps you unblock without giving away the answer.

### 🚀 Key Features

- **Dynamic Problem Generation**:
  - Instantly generate unique problems based on topics (e.g., DP, Graphs, Greedy) and difficulty levels.
  - **Custom Mode**: Describe a scenario to generate a tailored problem.
- **AI "Static Analysis" Judge**:
  - Evaluates code logic without running test cases.
  - Detects logic errors, edge cases, and incorrect complexity ($O(N)$ vs $O(N^2)$).
- **Smart Assistance**:
  - **Hints**: Request nudges in the right direction.
  - **Model Solutions**: Generate complete reference solutions with detailed complexity proofs.
- **Developer Experience**:
  - **1-Click Startup**: Use `run_app.bat` for instant setup.
  - **LaTeX Support**: Renders mathematical formulas beautifully.
  - **Print Friendly**: Optimized CSS for printing problems.

### 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Tailwind + Animations), JavaScript (Modules)
- **Backend**: Python (Flask)
- **Database**: SQLite (User Data & History)
- **AI Core**: **Ollama** (Local LLM Inference)

### ⚡ Installation & Setup

1.  **Prerequisites**:
    - Python 3.9+
    - **[Ollama](https://ollama.ai/)** installed and running.

2.  **Setup Ollama**:
    - Install Ollama.
    - Pull recommended models:
      ```bash
      ollama pull qwen2.5:7b
      ollama pull qwen2.5:32b
      ```
    - *See [OLLAMA_SETUP.md](OLLAMA_SETUP.md) for detailed configuration.*

3.  **Clone the Repository**:
    ```bash
    git clone https://github.com/HoaThang34/CP-COACH-AI.git
    cd CP-COACH-AI
    ```

4.  **Run (Windows)**:
    - Double-click **`run_app.bat`**. It will automatically install dependencies and start the app.

5.  **Manual Start**:
    ```bash
    pip install -r requirements.txt
    python -m api.index
    ```

6.  **Configuration (Optional)**:
    - The app uses default models (`qwen2.5:7b` / `qwen2.5:32b`).
    - To customize, create a `.env` file:
      ```env
      OLLAMA_BASE_URL=http://localhost:11434
      OLLAMA_MODEL_FAST=mistral
      OLLAMA_MODEL_THINKING=llama3:70b
      ```

---

<a name="tiếng-việt"></a>
## 🇻🇳 Tiếng Việt

**CP Coach AI** là nền tảng luyện tập lập trình thi đấu thế hệ mới, hoạt động hoàn toàn **offline với Ollama**. Hệ thống cung cấp khả năng **chấm bài tức thì không cần test case** thông qua phân tích tĩnh, đồng thời cung cấp phản hồi thông minh và lộ trình học cá nhân hóa với độ bảo mật tuyệt đối.

Công cụ đắc lực cho học sinh ôn thi **HSG Quốc gia**, **ICPC**, và **Codeforces**, tập trung rèn luyện tư duy thuật toán và tối ưu độ phức tạp.

### 🌟 Điểm Mới
- **Sức mạnh AI Offline**: Chạy trực tiếp trên máy tính của bạn thông qua Ollama (miễn phí, bảo mật).
- **Giao diện Premium**: Hiệu ứng chuyển động mượt mà (Animations), thiết kế Glassmorphism.
- **Hệ thống Tài khoản**: Đăng ký/Đăng nhập bảo mật để lưu trữ lịch sử làm bài.
- **Trợ lý Chat AI Real-time**: Gia sư ảo thông minh, giúp giải đáp thắc mắc theo ngữ cảnh.

### 🚀 Tính Năng Chính

- **Tạo Đề Bài Động**:
  - Sinh đề bài mới tức thì theo chủ đề (Quy hoạch động, Đồ thị...) và độ khó.
  - **Chế độ Tùy chọn**: Nhập ý tưởng để AI tạo đề bài riêng cho bạn.
- **AI Chấm Bài (Phân Tích Tĩnh)**:
  - Đánh giá logic thuật toán mà không cần chạy test case.
  - Phát hiện lỗi sai tư duy, trường hợp biên và độ phức tạp chưa tối ưu.
- **Hỗ Trợ Thông Minh**:
  - **Gợi ý (Hint)**: Hướng dẫn giải quyết vấn đề từng bước.
  - **Lời Giải Mẫu**: Cung cấp code mẫu chuẩn kèm chứng minh độ phức tạp.
- **Trải Nghiệm Tiện Lợi**:
  - **Khởi động 1-click**: File `run_app.bat` tự động cài đặt và chạy app.
  - **Hỗ trợ Toán học**: Hiển thị công thức LaTeX đẹp mắt.
  - **In ấn Tối ưu**: Giao diện in đề bài chuyên nghiệp.

### 🛠️ Công Nghệ Sử Dụng

- **Frontend**: HTML5, CSS3 (Tailwind + Animations), JavaScript
- **Backend**: Python (Flask)
- **Cơ sở dữ liệu**: SQLite
- **AI Core**: **Ollama** (Local LLM)

### ⚡ Cài Đặt & Sử Dụng

1.  **Yêu cầu**:
    - Python 3.9 trở lên
    - Cài đặt **[Ollama](https://ollama.ai/)**.

2.  **Cài đặt Ollama**:
    - Tải và cài đặt Ollama.
    - Tải các model khuyến nghị (trong terminal):
      ```bash
      ollama pull qwen2.5:7b
      ollama pull qwen2.5:32b
      ```
    - *Xem chi tiết tại [OLLAMA_SETUP.md](OLLAMA_SETUP.md).*

3.  **Tải mã nguồn**:
    ```bash
    git clone https://github.com/HoaThang34/CP-COACH-AI.git
    cd CP-COACH-AI
    ```

4.  **Chạy nhanh (Windows)**:
    - Click đúp vào file **`run_app.bat`**.

5.  **Chạy thủ công**:
    ```bash
    pip install -r requirements.txt
    python -m api.index
    ```

6.  **Cấu hình (Tùy chọn)**:
    - Mặc định app dùng `qwen2.5:7b` (nhanh) và `qwen2.5:32b` (thông minh).
    - Để đổi model, tạo file `.env`:
      ```env
      OLLAMA_BASE_URL=http://localhost:11434
      OLLAMA_MODEL_FAST=mistral
      OLLAMA_MODEL_THINKING=llama3:70b
      ```

---

## 📄 License

Project is open-source for educational purposes.
Developed by **Hoa Quang Thang**.
