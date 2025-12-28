# TalkFlow
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=github)](https://talkflow-demo.vercel.app)

🌐 Live Demo : [https://talkflow-demo.vercel.app](https://talkflow-demo.vercel.app)  
*Note: The backend is hosted on Render's free tier. If the site takes time to load, it may be waking up due to inactivity.*

---
# TalkFlow : Full-stack AI chatbot

TalkFlow is a full-stack AI chatbot with advanced RAG capabilities:

- FastAPI backend (Python 3.12)
- Orchestrated RAG retrieval (hybrid semantic + keyword search with intelligent fallback)
- ChromaDB persistent vector storage with JSON fallback
- **Hugging Face Inference API** for high-quality LLM responses (Llama 3.2-3B-Instruct)
- sentence-transformers embeddings (all-MiniLM-L6-v2, runs locally)
- Next.js 14 frontend (app router) with modern dark-themed streaming chat UI
- Personality selection, multilingual support (en/es/fr), browser voice in/out (Web Speech API)

This repository is scaffolded for local development (no Docker by default).

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** and npm installed
3. **Hugging Face Account** (free) - [Sign up here](https://huggingface.co/join)

## Setup Instructions

### 1. Get Your Hugging Face API Token

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **"New token"**
3. Name it (e.g., "TalkFlow")
4. Select **"Read"** access
5. Click **"Generate"**
6. **Copy the token** (you'll need it in step 3)

### 2. Install Backend Dependencies

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```powershell
# Still in backend directory
copy .env.example .env
```

Then open `.env` file and replace `your_token_here` with your actual Hugging Face token:

```
HF_API_TOKEN=hf_YourActualTokenHere123456789
```

### 4. Start Backend

```powershell
# Make sure you're in backend directory with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Install and Start Frontend

Open a **new terminal**:

```powershell
cd frontend
npm install
npm run dev
```

### 6. Open the App

Open your browser and go to: **http://localhost:3000**

## Quick start (Windows PowerShell)

After initial setup, just run these in two terminals:

**Terminal 1 (Backend):**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

## Notes

🌐 Backend URL : [https://talkflow-b01t.onrender.com](https://talkflow-b01t.onrender.com)  

*Note: For testing visit https://eventhub-backend-z1da.onrender.com/docs*

- The backend uses **Hugging Face Inference API** (free tier) with Llama 3.2-3B-Instruct for high-quality responses
- Embeddings run locally using sentence-transformers/all-MiniLM-L6-v2 (no API needed)
- ChromaDB stores vectors persistently in `db/` directory for fast retrieval
- Orchestrated retrieval combines semantic search, keyword matching, and hybrid approaches
- First API call may take 10-20 seconds as the model loads
- Free tier has rate limits; for production, consider paid tier
- To change models, edit the model name in `backend/app/core/llm.py`

## Features

- ✅ Upload documents (PDF, TXT, MD) for RAG with drag-and-drop UI
- ✅ Real-time SSE streaming responses (token-by-token)
- ✅ Orchestrated retrieval (semantic + keyword + hybrid strategies)
- ✅ Persistent ChromaDB vector storage
- ✅ Personality modes (Default, Yoda, Pirate) with visual UI
- ✅ Multilingual support (English, Spanish, French)
- ✅ Voice input/output (browser-based TTS/STT)
- ✅ Modern dark-themed ChatGPT-like interface
- ✅ Conversation memory per session

See `backend/README.md` and `frontend/README.md` for more details.
