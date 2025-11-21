import os
from typing import Optional
from PyPDF2 import PdfReader

def extract_text_from_file(path: str) -> str:
    _, ext = os.path.splitext(path.lower())
    if ext in (".txt", ".md"):
        with open(path, "r", encoding="utf8", errors="ignore") as f:
            return f.read()
    if ext == ".pdf":
        text = []
        reader = PdfReader(path)
        for page in reader.pages:
            try:
                text.append(page.extract_text() or "")
            except Exception:
                continue
        return "\n".join(text)
    # fallback: return empty string
    return ""
