# Polychat

Hệ thống website chat với AI models dựa trên kiến trúc monorepo.

## Tổng quan

Polychat là một ứng dụng chat AI được xây dựng với:
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Monorepo**: Turborepo + pnpm workspaces

## Cấu trúc dự án

```
📁 polychat/
├── 📂 apps/
│   ├── 🌐 web/                   # Frontend (Vite + React)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx      # Chat interface
│   │   │   │   └── ModelSelector.tsx   # Model selection
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── 🐍 api/                   # Backend (FastAPI)
│       ├── app/
│       │   ├── routers/          # API routes
│       │   ├── services/         # Business logic
│       │   └── models/           # Pydantic models
│       ├── main.py
│       └── requirements.txt
│
├── 📂 packages/                  # Shared packages
│   ├── 🎨 ui/                   # Shared React components
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Avatar.tsx
│   ├── 📝 types/                # TypeScript type definitions
│   ├── ⚙️ eslint-config-custom/ # Shared ESLint config
│   └── ⚙️ tsconfig/            # Shared TypeScript config
│
├── 📄 turbo.json
├── 📄 package.json
└── 📄 pnpm-workspace.yaml
```

## Yêu cầu hệ thống

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Python >= 3.9

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd polychat
```

### 2. Cài đặt dependencies cho Frontend

```bash
pnpm install
```

### 3. Cài đặt dependencies cho Backend

```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

## Chạy ứng dụng

### Development Mode

**Terminal 1 - Chạy Backend:**
```bash
cd apps/api
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```
Backend sẽ chạy tại: http://localhost:8000

**Terminal 2 - Chạy Frontend:**
```bash
# Từ thư mục root
pnpm dev
```
Frontend sẽ chạy tại: http://localhost:3000

### Hoặc sử dụng script nhanh cho Backend

```bash
cd apps/api
./run.sh  # Unix/Mac
```

## Tính năng

- Chat interface với multiple AI models
- Model selection (GPT-3.5, GPT-4, Claude 3 Sonnet)
- Responsive design với Tailwind CSS
- Shared UI components (Button, Input, Avatar)
- Type-safe với TypeScript
- REST API với FastAPI
- Mock AI responses (có thể dễ dàng thay thế bằng real API)

## API Endpoints

- `POST /api/chat` - Gửi tin nhắn chat
- `GET /api/models` - Lấy danh sách models
- `GET /health` - Health check
- `GET /docs` - API documentation (Swagger)
- `GET /` - Root endpoint

## Cấu hình AI Models

Hiện tại, hệ thống sử dụng **mock responses** để test. Để kết nối với AI APIs thực:

1. Tạo file `.env` trong `apps/api/`:
```bash
cp apps/api/.env.example apps/api/.env
```

2. Thêm API keys:
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

3. Sửa `apps/api/app/services/ai_service.py`:
   - Thay đổi method `generate_response()` để gọi:
     - `_call_openai_with_curl()` cho OpenAI models (gpt-3.5-turbo, gpt-4)
     - `_call_anthropic_with_curl()` cho Anthropic models (claude-3-sonnet)

**Lưu ý**: Service hiện đã implement sẵn các hàm curl để gọi API, bạn chỉ cần uncomment và sử dụng khi có API keys.

## Build cho Production

### Frontend
```bash
# Từ root directory
pnpm build
```

Build output sẽ ở trong `apps/web/dist/`

### Backend
Deploy FastAPI với:
```bash
cd apps/api
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Scripts hữu ích

```bash
pnpm dev          # Chạy frontend dev server
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm clean        # Clean all build artifacts
```

## Thư mục con

- [Frontend README](apps/web/README.md) - Chi tiết về web app
- [Backend README](apps/api/README.md) - Chi tiết về API

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: Custom component library (@polychat/ui)

### Backend
- **Framework**: FastAPI
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **HTTP Client**: httpx (cho API calls)

### Monorepo
- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Workspaces**: pnpm workspaces

### Code Quality
- ESLint với custom config
- TypeScript strict mode
- Prettier (via ESLint)

## Kiến trúc

### Shared Packages

**@polychat/ui** - Reusable React components
- `Button` - Customizable button với variants (primary, secondary, outline)
- `Input` - Input field với label và error handling
- `Avatar` - User avatar component

**@polychat/types** - Shared TypeScript types
- `Message` - Chat message structure
- `AIModel` - AI model definition
- `ChatSession` - Chat session data
- `ChatRequest/Response` - API contracts

**@polychat/tsconfig** - TypeScript configurations
- `base.json` - Base config cho tất cả packages
- `react.json` - Config cho React apps

**@polychat/eslint-config-custom** - ESLint rules
- React + TypeScript rules
- Prettier integration

### Apps

**@polychat/web** - Frontend application
- Chat interface với real-time messaging
- Model selection dropdown
- Responsive layout
- API integration với backend

**api** - Backend service
- RESTful API endpoints
- AI model integration
- CORS middleware
- Request/Response validation

## Development Workflow

1. **Thêm shared UI component mới**:
   ```bash
   # Thêm component vào packages/ui/src/
   # Export trong packages/ui/src/index.ts
   # Sử dụng trong apps/web
   ```

2. **Thêm API endpoint mới**:
   ```bash
   # Tạo router mới trong apps/api/app/routers/
   # Tạo service trong apps/api/app/services/
   # Register router trong apps/api/main.py
   ```

3. **Thêm shared type**:
   ```bash
   # Thêm type trong packages/types/src/index.ts
   # Sử dụng trong cả frontend và backend
   ```

## Troubleshooting

### Frontend không connect được với Backend
- Kiểm tra backend có chạy ở port 8000 không
- Kiểm tra CORS settings trong `apps/api/app/config.py`
- Kiểm tra proxy config trong `apps/web/vite.config.ts`

### pnpm install lỗi
- Xóa `node_modules` và `pnpm-lock.yaml`
- Chạy lại `pnpm install`

### Python dependencies lỗi
- Đảm bảo đang dùng Python 3.9+
- Activate virtual environment trước khi install
- Update pip: `pip install --upgrade pip`

## Roadmap

- [ ] Implement streaming responses
- [ ] Add chat history persistence
- [ ] Add user authentication
- [ ] Add more AI models
- [ ] Implement rate limiting
- [ ] Add tests (unit + integration)
- [ ] Add Docker support
- [ ] Add deployment guides

## License

MIT
