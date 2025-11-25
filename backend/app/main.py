import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil

from app.core.llm import llm
from app.core.store import VectorStore
from app.utils.file_processing import extract_text_from_file

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
    "default": "You are a helpful AI assistant. Answer clearly and concisely.",
    "yoda": "You are Yoda from Star Wars. Speak in Yoda's style: rearrange sentences, use wisdom and 'hmm' often. Example: 'Much to learn, you still have.'",
    "pirate": "You are a cheerful pirate. Use pirate slang like 'ahoy', 'matey', 'arr', 'treasure'. Talk about the sea and sailing.",
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
    
    # Build context from retrieved documents
    if hits and len(hits) > 0:
        context_parts = []
        for h in hits:
            if isinstance(h.get("metadata"), dict) and h["metadata"].get("text"):
                context_parts.append(h["metadata"]["text"])
        context = "\n".join(context_parts) if context_parts else "No relevant documents found."
    else:
        context = "No documents uploaded yet."
    
    # Get personality instruction
    persona = PERSONALITIES.get(personality, PERSONALITIES["default"])
    
    # Build a clear, structured prompt
    if context != "No documents uploaded yet." and context != "No relevant documents found.":
        prompt = f"{persona}\n\nContext from documents:\n{context}\n\nQuestion: {q}\n\nAnswer:"
    else:
        prompt = f"{persona}\n\nQuestion: {q}\n\nAnswer:"
    
    def event_stream():
        try:
            for chunk in llm.generate_stream(prompt):
                yield f"data: {chunk}\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
