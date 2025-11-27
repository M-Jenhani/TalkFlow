# Backend (FastAPI)

This folder contains the FastAPI backend for TalkFlow using Hugging Face Inference API.

## Setup

1. Install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Configure your Hugging Face token:

```powershell
copy .env.example .env
```

Edit `.env` and add your token from https://huggingface.co/settings/tokens

3. Run the server:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health` — health check
- `GET /personalities` — available personalities
- `POST /upload` — upload documents (multipart/form-data: file + metadata)
- `GET /stream` — SSE streaming query: params `q`, `session_id`, `personality`, `lang`

## Configuration

Edit `.env` file:

- `HF_API_TOKEN` — Your Hugging Face API token (required)
- `HF_INFERENCE_MODEL` — Model to use (default: mistralai/Mistral-7B-Instruct-v0.2)
- `HF_EMB_MODEL` — Embedding model (default: sentence-transformers/all-MiniLM-L6-v2)

## Available Models

Good free models for the Inference API:
- `mistralai/Mistral-7B-Instruct-v0.2` (default, great quality)
- `meta-llama/Llama-2-7b-chat-hf` (good, requires acceptance of license)
- `mistralai/Mixtral-8x7B-Instruct-v0.1` (best quality, slower)

## Notes

- First request may take 10-20 seconds as model loads
- Embeddings run locally (no API needed)
- Vector store: tries chromadb, falls back to JSON
- Free tier has rate limits (~1000 requests/day)
