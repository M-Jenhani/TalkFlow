# TalkFlow

TalkFlow is a local-first AI chatbot scaffold combining:

- FastAPI backend (Python)
- LangChain-style RAG (embeddings + retrieval)
- Optional Chroma vectorstore (falls back to local store)
- **Hugging Face Inference API** for high-quality LLM responses (Mistral-7B by default)
- sentence-transformers embeddings (local)
- Next.js 14 frontend (app router) with streaming chat UI
- Personality selection, multilingual prompts, browser voice in/out (Web Speech API)

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

- The backend uses **Hugging Face Inference API** (free tier) with Mistral-7B for high-quality responses
- Embeddings run locally using sentence-transformers (no API needed)
- First API call may take 10-20 seconds as the model loads
- Free tier has rate limits; for production, consider paid tier
- To change models, edit `HF_INFERENCE_MODEL` in `.env` file

## Features

- ✅ Upload documents (PDF, TXT, MD) for RAG
- ✅ Real streaming responses (token-by-token)
- ✅ Personality modes (Default, Yoda, Pirate)
- ✅ Multilingual support
- ✅ Voice input/output (browser-based)
- ✅ Conversation memory per session

See `backend/README.md` and `frontend/README.md` for more details.