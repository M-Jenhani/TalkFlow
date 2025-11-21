# TalkFlow

TalkFlow is a local-first AI chatbot scaffold combining:

- FastAPI backend (Python)
- LangChain-style RAG (embeddings + retrieval)
- Optional Chroma vectorstore (falls back to local store)
- Hugging Face / Transformers LLM (small default) and sentence-transformers embeddings
- Next.js 14 frontend (app router) with streaming chat UI
- Personality selection, multilingual prompts, browser voice in/out (Web Speech API)

This repository is scaffolded for local development (no Docker by default).

## Quick start (Windows PowerShell)

1. Backend

- Create a virtual environment and activate it:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Frontend

Open a new shell, then:

```powershell
cd frontend
npm install
npm run dev
```

3. Use

- Open `http://localhost:3000` for the web app.
- Backend endpoints run at `http://localhost:8000`.

## Notes

- The backend will try to use `chromadb` if installed; otherwise it falls back to a lightweight on-disk vector store.
- For production-grade LLMs, configure environment variables and swap the model in `backend/app/core/llm.py`.

See `backend/README.md` and `frontend/README.md` for more details.