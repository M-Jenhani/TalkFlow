#!/bin/bash
set -e

echo "Installing dependencies..."
pip install --no-cache-dir -r requirements.txt

# Get the PORT from environment (Render sets this automatically)
PORT=${PORT:-8000}

echo "Starting FastAPI server on port $PORT..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1
