# Quick Start - Polychat

Hướng dẫn nhanh để chạy Polychat trong 3 phút.

## Cài đặt nhanh

### Bước 1: Cài dependencies

```bash
# Frontend
pnpm install

# Backend
cd apps/api
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### Bước 2: Chạy dev servers

**Option 1 - Dùng script tự động (macOS/Linux):**
```bash
./dev.sh
```

**Option 2 - Chạy thủ công (2 terminals):**

Terminal 1 - Backend:
```bash
cd apps/api
source venv/bin/activate
python main.py
```

Terminal 2 - Frontend:
```bash
pnpm dev
```

### Bước 3: Mở browser

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Đó là tất cả!

Giờ bạn có thể chat với AI (mock responses).

Để kết nối AI thật → Xem [SETUP.md](SETUP.md) hoặc [README.md](README.md)
