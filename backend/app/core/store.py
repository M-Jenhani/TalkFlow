import os
import json
import numpy as np
from typing import List, Dict, Optional

try:
    import chromadb
    from chromadb.utils import embedding_functions
    CHROMA_AVAILABLE = True
except Exception:
    CHROMA_AVAILABLE = False


class VectorStore:
    def __init__(self, persist_dir: str = "c:\\portfolioforcv\\TalkFlow\\db"):
        self.persist_dir = persist_dir
        os.makedirs(self.persist_dir, exist_ok=True)
        if CHROMA_AVAILABLE:
            # Use persistent client instead of in-memory
            client = chromadb.PersistentClient(path=self.persist_dir)
            # Get or create collection
            try:
                self.col = client.get_collection(name="talkflow")
            except:
                self.col = client.create_collection(name="talkflow")
        else:
            self.path = os.path.join(self.persist_dir, "store.json")
            if os.path.exists(self.path):
                with open(self.path, "r", encoding="utf8") as f:
                    self._store = json.load(f)
            else:
                self._store = {"ids": [], "embeddings": [], "metadatas": []}

    def add(self, ids: List[str], embeddings: List[List[float]], metadatas: List[Dict]):
        if CHROMA_AVAILABLE:
            self.col.add(ids=ids, embeddings=embeddings, metadatas=metadatas)
        else:
            self._store["ids"].extend(ids)
            self._store["embeddings"].extend(embeddings)
            self._store["metadatas"].extend(metadatas)
            with open(self.path, "w", encoding="utf8") as f:
                json.dump(self._store, f)

    def _cosine_sim(self, a: np.ndarray, b: np.ndarray) -> float:
        if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
            return 0.0
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

    def query(self, embedding: List[float], top_k: int = 3) -> List[Dict]:
        if CHROMA_AVAILABLE:
            res = self.col.query(query_embeddings=[embedding], n_results=top_k)
            results = []
            for i in range(len(res["ids"])):
                for j, _id in enumerate(res["ids"][i]):
                    results.append({
                        "id": _id,
                        "metadata": res["metadatas"][i][j],
                        "score": res["distances"][i][j],
                    })
            return results
        else:
            if len(self._store["ids"]) == 0:
                return []
            emb_arr = np.array(self._store["embeddings"])
            q = np.array(embedding)
            sims = [self._cosine_sim(q, e) for e in emb_arr]
            idxs = sorted(range(len(sims)), key=lambda i: sims[i], reverse=True)[:top_k]
            return [
                {"id": self._store["ids"][i], "metadata": self._store["metadatas"][i], "score": sims[i]}
                for i in idxs
            ]
