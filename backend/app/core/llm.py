import os
from typing import List

from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from sentence_transformers import SentenceTransformer
import numpy as np

# Default models - flan-t5-base is 250MB, better quality than small
# For even better: try "google/flan-t5-large" (800MB) or "google/flan-t5-xl" (3GB)
HF_GEN_MODEL = os.environ.get("HF_GEN_MODEL", "google/flan-t5-base")
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

    def generate(self, prompt: str, max_length: int = 512) -> str:
        out = self.pipe(
            prompt, 
            max_new_tokens=256,
            do_sample=True, 
            temperature=0.7,
            top_k=50, 
            top_p=0.95,
            repetition_penalty=1.2
        )
        return out[0]["generated_text"]

    def generate_stream(self, prompt: str, chunk_size: int = 120):
        # Lightweight streaming: generate full text then yield chunks.
        text = self.generate(prompt)
        for i in range(0, len(text), chunk_size):
            yield text[i : i + chunk_size]


llm = LLM()
