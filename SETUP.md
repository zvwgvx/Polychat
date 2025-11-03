# Hướng dẫn Setup và Chạy Dev Polychat

Hướng dẫn chi tiết từng bước để setup và chạy dự án Polychat.

---

## Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0
- **Python** >= 3.9 ([Download](https://www.python.org/))

### Kiểm tra version:

```bash
node --version   # Phải >= 18.0.0
python3 --version # Phải >= 3.9
```

### Cài đặt pnpm (nếu chưa có):

```bash
npm install -g pnpm
# Hoặc
brew install pnpm  # macOS
```

---

## Bước 1: Clone và di chuyển vào thư mục dự án

```bash
cd /Users/zvwgvx/PycharmProjects/Polychat
```

---

## Bước 2: Setup Frontend (Vite + React)

### 2.1. Cài đặt dependencies

Từ thư mục root của dự án:

```bash
pnpm install
```

Lệnh này sẽ:
- Cài đặt dependencies cho tất cả workspaces
- Cài đặt packages shared (ui, types, tsconfig, eslint-config-custom)
- Cài đặt dependencies cho apps/web

**Đợi quá trình hoàn tất** (có thể mất 1-2 phút)

### 2.2. Kiểm tra cài đặt

```bash
ls node_modules  # Nên thấy nhiều packages
ls apps/web/node_modules  # Nên có symlinks đến shared packages
```

---

## Bước 3: Setup Backend (FastAPI)

### 3.1. Di chuyển vào thư mục API

```bash
cd apps/api
```

### 3.2. Tạo Python Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv venv
```

**Windows:**
```bash
python -m venv venv
```

### 3.3. Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

Bạn sẽ thấy `(venv)` xuất hiện ở đầu dòng lệnh.

### 3.4. Cài đặt Python dependencies

```bash
pip install --upgrade pip  # Update pip
pip install -r requirements.txt
```

Dependencies sẽ được cài:
- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- pydantic==2.5.0
- pydantic-settings==2.1.0
- python-dotenv==1.0.0
- httpx==0.25.1

### 3.5. Tạo file .env (Optional)

```bash
cp .env.example .env
```

File `.env` này để chứa API keys khi bạn muốn kết nối với AI APIs thật. Hiện tại dùng mock nên không cần.

### 3.6. Quay về thư mục root

```bash
cd ../..
```

---

## Bước 4: Chạy Development Servers

Bạn cần **2 terminals** để chạy đồng thời frontend và backend.

### Terminal 1️⃣ - Chạy Backend (FastAPI)

```bash
# Từ thư mục root
cd apps/api

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# HOẶC
venv\Scripts\activate     # Windows

# Chạy server
python main.py
```

**Kết quả mong đợi:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Backend API sẽ chạy tại: **http://localhost:8000**

**Kiểm tra:**
- Mở browser: http://localhost:8000 (nên thấy welcome message)
- Xem docs: http://localhost:8000/docs (Swagger UI)

### Terminal 2️⃣ - Chạy Frontend (Vite + React)

Mở terminal mới:

```bash
# Từ thư mục root
cd /Users/zvwgvx/PycharmProjects/Polychat

# Chạy dev server
pnpm dev
```

**Hoặc chỉ chạy web app:**
```bash
pnpm --filter @polychat/web dev
```

**Kết quả mong đợi:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h to show help
```

Frontend sẽ chạy tại: **http://localhost:3000**

---

## Bước 5: Kiểm tra ứng dụng hoạt động

### 5.1. Mở browser

Truy cập: **http://localhost:3000**

Bạn sẽ thấy:
- Header "Polychat"
- Dropdown chọn model (GPT-3.5, GPT-4, Claude 3 Sonnet)
- Chat window trống
- Input box để gửi tin nhắn

### 5.2. Test chat

1. Chọn model từ dropdown
2. Gõ tin nhắn vào input box
3. Click "Send" hoặc nhấn Enter
4. Bạn sẽ thấy tin nhắn của bạn xuất hiện bên phải (màu xanh)
5. Sau đó AI response (mock) xuất hiện bên trái (màu xám)

**Lưu ý:** Hiện tại đang dùng mock responses, không gọi AI APIs thật.

### 5.3. Test API endpoints

Mở http://localhost:8000/docs để xem tất cả endpoints:

**Test bằng curl:**
```bash
# Health check
curl http://localhost:8000/health

# List models
curl http://localhost:8000/api/models

# Send chat message
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

---

## Bước 6: Dừng servers

### Dừng Frontend (Terminal 2)
Nhấn `Ctrl + C`

### Dừng Backend (Terminal 1)
Nhấn `Ctrl + C`

Sau đó deactivate virtual environment:
```bash
deactivate
```

---

## Script nhanh cho lần sau

Để chạy nhanh hơn lần sau, bạn có thể dùng:

### Backend (apps/api/run.sh)

**macOS/Linux:**
```bash
cd apps/api
./run.sh
```

### Frontend

```bash
pnpm dev
```

---

## Troubleshooting

### ❌ Lỗi: "pnpm: command not found"

**Giải pháp:**
```bash
npm install -g pnpm
```

### ❌ Lỗi: "python3: command not found"

**Giải pháp:**
- Cài Python từ https://www.python.org/
- Hoặc dùng `python` thay vì `python3`

### ❌ Lỗi: Port 3000 đã được sử dụng

**Giải pháp:**
```bash
# Tìm process đang dùng port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Hoặc đổi port trong vite.config.ts
```

### ❌ Lỗi: Port 8000 đã được sử dụng

**Giải pháp:**
```bash
# Tìm và kill process
lsof -ti:8000 | xargs kill -9  # macOS/Linux

# Hoặc đổi port trong apps/api/.env
API_PORT=8001
```

### ❌ Frontend không kết nối được Backend

**Kiểm tra:**
1. Backend có đang chạy không? → Check http://localhost:8000
2. Check Console trong browser (F12) xem có lỗi không
3. Kiểm tra CORS settings trong `apps/api/app/config.py`

### ❌ Lỗi khi install dependencies Python

**Giải pháp:**
```bash
# Upgrade pip
pip install --upgrade pip

# Thử lại
pip install -r requirements.txt
```

### ❌ pnpm install bị lỗi

**Giải pháp:**
```bash
# Xóa cache và thử lại
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

## Cấu trúc thư mục sau khi setup

```
polychat/
├── node_modules/              # Dependencies cho frontend
├── apps/
│   ├── web/
│   │   └── node_modules/      # Symlinks đến shared packages
│   └── api/
│       ├── venv/              # Python virtual environment
│       └── .env               # Config (optional)
├── packages/
│   ├── ui/
│   ├── types/
│   ├── tsconfig/
│   └── eslint-config-custom/
└── pnpm-lock.yaml
```

---

## Checklist hoàn thành

- [ ] Node.js >= 18 đã cài
- [ ] pnpm đã cài
- [ ] Python >= 3.9 đã cài
- [ ] `pnpm install` thành công
- [ ] Python venv đã tạo và activate
- [ ] `pip install -r requirements.txt` thành công
- [ ] Backend chạy thành công ở http://localhost:8000
- [ ] Frontend chạy thành công ở http://localhost:3000
- [ ] Có thể gửi và nhận tin nhắn trong chat

---

## Next Steps

Sau khi dev environment đã chạy:

1. **Kết nối AI APIs thật:**
   - Tạo `.env` file
   - Thêm API keys (OpenAI, Anthropic)
   - Sửa `apps/api/app/services/ai_service.py`

2. **Customize UI:**
   - Sửa components trong `apps/web/src/components/`
   - Thêm shared components trong `packages/ui/src/`

3. **Thêm features:**
   - Chat history
   - User authentication
   - Streaming responses
   - Multiple chat sessions

---

## Liên hệ & Tài liệu

- Main README: [README.md](./README.md)
- Frontend docs: [apps/web/README.md](./apps/web/README.md)
- Backend docs: [apps/api/README.md](./apps/api/README.md)

---

**Chúc bạn code vui vẻ! 🚀**
