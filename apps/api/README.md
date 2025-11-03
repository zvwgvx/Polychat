# Polychat API

Backend API for Polychat built with FastAPI.

## Setup

1. Create a Python virtual environment:
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file (optional):
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Running the API

Development mode (with auto-reload):
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Chat
- `POST /api/chat` - Send a chat message
- `GET /api/models` - List available models

### Health
- `GET /` - Root endpoint
- `GET /health` - Health check

## AI Service Implementation

The AI service currently uses mock responses for testing. To use real AI APIs:

1. Add your API keys to `.env`:
```
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

2. Modify `app/services/ai_service.py` to use the curl-based implementations:
   - `_call_openai_with_curl` for OpenAI models
   - `_call_anthropic_with_curl` for Anthropic models
