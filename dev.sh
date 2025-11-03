#!/bin/bash

# Polychat Development Script
# Chạy script này để start cả frontend và backend

echo "🚀 Starting Polychat Development Environment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Please install pnpm: npm install -g pnpm"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo "Please install Python 3.9 or higher"
    exit 1
fi

echo -e "${BLUE}📦 Checking frontend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    pnpm install
else
    echo "✓ Frontend dependencies OK"
fi

echo ""
echo -e "${BLUE}🐍 Checking backend setup...${NC}"
cd apps/api

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

if [ ! -f "venv/bin/uvicorn" ]; then
    echo "Installing Python dependencies..."
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
else
    echo "✓ Python dependencies OK"
fi

cd ../..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Starting servers...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Backend:${NC}  http://localhost:8000"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}API Docs:${NC} http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${RED}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
cd apps/api
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ../..

# Wait a bit for backend to start
sleep 2

# Start frontend in foreground
pnpm dev &
FRONTEND_PID=$!

# Wait for frontend
wait $FRONTEND_PID
