# Backend (FastAPI)

This folder contains the FastAPI backend for TalkFlow.

Quick start (PowerShell):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Endpoints:
- `GET /health` — health check
- `GET /personalities` — available personalities
- `POST /upload` — upload documents (multipart/form-data: file + metadata)
- `GET /stream` — SSE streaming query: params `q`, `session_id`, `personality`, `lang`

Notes:
- The backend will try to import `chromadb`. If not installed it uses a fallback local JSON vector store.
- Swap models in `app/core/llm.py` for better performance/quality.
