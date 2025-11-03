#!/bin/bash

# Polychat API Start Script

echo "Starting Polychat API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Run the API
echo "Starting FastAPI server..."
python main.py
