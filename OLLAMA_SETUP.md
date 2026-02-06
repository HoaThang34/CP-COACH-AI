# CP Coach AI - Ollama Setup Guide

## Yêu cầu hệ thống

### 1. Cài đặt Ollama

**Windows:**
1. Tải Ollama từ: https://ollama.ai/download
2. Chạy file installer và làm theo hướng dẫn
3. Ollama sẽ tự động chạy dưới nền

**Linux/macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Pull các model cần thiết

Mở terminal/command prompt và chạy:

```bash
# Model nhanh (cho generate problem, hints, chat)
ollama pull qwen2.5:7b

# Model thinking (cho analyze solution, generate solution)
ollama pull qwen2.5:32b
```

> **Lưu ý**: 
> - Model 7B cần ~8GB RAM
> - Model 32B cần ~20GB RAM
> - Nếu RAM không đủ, có thể dùng model nhỏ hơn như `qwen2.5:3b` hoặc `mistral:7b`

### 3. Kiểm tra Ollama đã chạy

```bash
curl http://localhost:11434/api/tags
```

Nếu thành công sẽ thấy danh sách models đã pull.

---

## Cấu hình CP Coach AI

### 1. Cấu hình Environment Variables

File `.env.local` đã được cấu hình mặc định:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL_FAST=qwen2.5:7b
OLLAMA_MODEL_THINKING=qwen2.5:32b
SECRET_KEY=your-secret-key-change-in-production
```

**Tùy chỉnh models** (nếu cần):
- Nếu muốn dùng model khác, thay đổi `OLLAMA_MODEL_FAST` và `OLLAMA_MODEL_THINKING`
- Ví dụ: `llama3:8b`, `mistral:latest`, `codellama:13b`

### 2. Cài đặt Python Dependencies

```bash
pip install -r requirements.txt
```

---

## Chạy ứng dụng

### Windows:
```bash
run_app.bat
```

### Linux/macOS:
```bash
python -m api.index
```

Truy cập: http://localhost:3434

---

## Troubleshooting

### Lỗi: "Không thể kết nối đến Ollama server"

**Giải pháp:**
1. Kiểm tra Ollama đã chạy chưa:
   ```bash
   curl http://localhost:11434/api/tags
   ```
2. Nếu chưa chạy:
   - Windows: Mở Ollama app từ Start Menu
   - Linux/macOS: `ollama serve`

### Lỗi: "Model not found"

**Giải pháp:**
Pull model về máy:
```bash
ollama pull qwen2.5:7b
ollama pull qwen2.5:32b
```

### App chạy chậm

**Nguyên nhân**: Model lớn, RAM/CPU không đủ mạnh.

**Giải pháp**:
1. Dùng model nhỏ hơn (3B, 7B thay vì 32B)
2. Cấu hình lại `.env.local`:
   ```env
   OLLAMA_MODEL_FAST=qwen2.5:3b
   OLLAMA_MODEL_THINKING=qwen2.5:7b
   ```

### JSON parsing errors

**Nguyên nhân**: Model trả về format không chuẩn.

**Giải pháp**:
- Thử model khác có khả năng instruction-following tốt hơn
- Recommend: `qwen2.5`, `mistral`, `llama3`

---

## Recommended Models

| Use Case | Model | RAM Required | Quality |
|----------|-------|--------------|---------|
| **Fastest** | qwen2.5:3b | ~4GB | Good |
| **Balanced** | qwen2.5:7b | ~8GB | Very Good |
| **Best Quality** | qwen2.5:32b | ~20GB | Excellent |
| **Alternative** | llama3:8b | ~8GB | Very Good |
| **Code Focus** | codellama:13b | ~12GB | Excellent (for code) |

---

## So sánh với Google Gemini

| Aspect | Google Gemini | Ollama (Local) |
|--------|---------------|----------------|
| **Chi phí** | Có phí API | Miễn phí |
| **Tốc độ** | Rất nhanh | Phụ thuộc phần cứng |
| **Privacy** | Dữ liệu gửi lên cloud | Hoàn toàn offline |
| **Quality** | Rất cao | Tốt (phụ thuộc model) |
| **Setup** | Dễ (chỉ cần API key) | Cần cài đặt thêm |

---

## Bonus: Auto-start Ollama (Optional)

### Windows
Ollama tự động chạy khi khởi động máy sau khi cài đặt.

### Linux (systemd)
```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```

### macOS
Ollama sẽ thêm vào Login Items tự động.
