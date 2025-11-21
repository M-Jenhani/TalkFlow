import os
from typing import List

from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from sentence_transformers import SentenceTransformer
import numpy as np

# Small default models for local testing — swap for larger models in production
HF_GEN_MODEL = os.environ.get("HF_GEN_MODEL", "google/flan-t5-small")
HF_EMB_MODEL = os.environ.get("HF_EMB_MODEL", "sentence-transformers/all-MiniLM-L6-v2")


class LLM:
    def __init__(self):
        # text-generation (seq2seq) pipeline
        self.tokenizer = AutoTokenizer.from_pretrained(HF_GEN_MODEL)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(HF_GEN_MODEL)
        self.pipe = pipeline("text2text-generation", model=self.model, tokenizer=self.tokenizer, device_map="auto" if False else -1)

        # embeddings
        self.embedder = SentenceTransformer(HF_EMB_MODEL)

    def embed(self, texts: List[str]) -> List[List[float]]:
        embs = self.embedder.encode(texts, convert_to_numpy=True)
        return [e.tolist() for e in embs]

    def generate(self, prompt: str, max_length: int = 256) -> str:
        out = self.pipe(prompt, max_length=max_length, do_sample=True, top_k=50, top_p=0.95)
        return out[0]["generated_text"]

    def generate_stream(self, prompt: str, chunk_size: int = 120):
        # Lightweight streaming: generate full text then yield chunks.
        text = self.generate(prompt)
        for i in range(0, len(text), chunk_size):
            yield text[i : i + chunk_size]


llm = LLM()
