import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil

from core.llm import llm
from core.store import VectorStore
from utils.file_processing import extract_text_from_file

app = FastAPI(title="TalkFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

store = VectorStore(persist_dir=os.path.join(BASE_DIR, "..", "..", "db"))

# basic personalities
PERSONALITIES = {
    "default": "A helpful, concise assistant.",
    "yoda": "Answer like Yoda from Star Wars: invert sentences, wise tone.",
    "pirate": "Answer like a cheerful pirate, use nautical slang.",
}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/personalities")
def personalities():
    return {"personalities": list(PERSONALITIES.keys())}


@app.post("/upload")
async def upload(file: UploadFile = File(...), metadata: str = Form("")):
    file_id = str(uuid.uuid4())
    filename = f"{file_id}_{file.filename}"
    dest = os.path.join(UPLOAD_DIR, filename)
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    text = extract_text_from_file(dest)
    if text:
        # split simply by paragraphs
        docs = [p.strip() for p in text.split("\n\n") if p.strip()]
        ids = [str(uuid.uuid4()) for _ in docs]
        embs = llm.embed(docs)
        metadatas = [{"source": file.filename, "meta": metadata, "text": docs[i]} for i in range(len(docs))]
        store.add(ids=ids, embeddings=embs, metadatas=metadatas)
        return {"status": "ok", "added_chunks": len(docs)}
    return {"status": "empty"}


@app.get("/stream")
def stream(q: str, session_id: str = "default", personality: str = "default", lang: str = "en"):
    # Embed query, fetch top docs, build prompt
    q_emb = llm.embed([q])[0]
    hits = store.query(q_emb, top_k=3)
    context = "\n\n".join([h["metadata"]["text"] if isinstance(h.get("metadata"), dict) and h["metadata"].get("text") else str(h.get("metadata")) for h in hits])
    persona = PERSONALITIES.get(personality, PERSONALITIES["default"])
    prompt = f"You are: {persona}\nLanguage: {lang}\nContext: {context}\nUser: {q}\nAssistant:"

    def event_stream():
        try:
            for chunk in llm.generate_stream(prompt):
                yield f"data: {chunk}\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
