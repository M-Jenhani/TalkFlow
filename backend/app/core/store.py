import os
import json
import numpy as np
from typing import List, Dict, Optional
from collections import Counter

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
        """Standard semantic similarity search"""
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

    def keyword_search(self, query: str, top_k: int = 3) -> List[Dict]:
        """Keyword-based search (BM25-like)"""
        query_terms = set(query.lower().split())
        scores = []
        
        if CHROMA_AVAILABLE:
            all_docs = self.col.get()
            metadatas = all_docs["metadatas"]
            ids = all_docs["ids"]
        else:
            if len(self._store["ids"]) == 0:
                return []
            metadatas = self._store["metadatas"]
            ids = self._store["ids"]
        
        for i, meta in enumerate(metadatas):
            text = meta.get("text", "").lower()
            doc_terms = set(text.split())
            # Simple term frequency scoring
            overlap = len(query_terms.intersection(doc_terms))
            score = overlap / len(query_terms) if query_terms else 0
            scores.append((i, score, ids[i], meta))
        
        # Sort by score descending
        scores.sort(key=lambda x: x[1], reverse=True)
        return [
            {"id": ids_val, "metadata": meta, "score": score}
            for _, score, ids_val, meta in scores[:top_k]
        ]

    def hybrid_search(self, embedding: List[float], query: str, top_k: int = 3, alpha: float = 0.7) -> List[Dict]:
        """
        Hybrid search combining semantic and keyword retrieval
        alpha: weight for semantic search (1-alpha for keyword)
        """
        # Get semantic results
        semantic_results = self.query(embedding, top_k=top_k * 2)
        # Get keyword results
        keyword_results = self.keyword_search(query, top_k=top_k * 2)
        
        # Combine scores
        combined_scores = {}
        
        # Normalize and combine semantic scores
        max_sem_score = max([r["score"] for r in semantic_results]) if semantic_results else 1
        for r in semantic_results:
            doc_id = r["id"]
            normalized_score = r["score"] / max_sem_score if max_sem_score > 0 else 0
            combined_scores[doc_id] = {
                "score": alpha * normalized_score,
                "metadata": r["metadata"]
            }
        
        # Normalize and combine keyword scores
        max_kw_score = max([r["score"] for r in keyword_results]) if keyword_results else 1
        for r in keyword_results:
            doc_id = r["id"]
            normalized_score = r["score"] / max_kw_score if max_kw_score > 0 else 0
            if doc_id in combined_scores:
                combined_scores[doc_id]["score"] += (1 - alpha) * normalized_score
            else:
                combined_scores[doc_id] = {
                    "score": (1 - alpha) * normalized_score,
                    "metadata": r["metadata"]
                }
        
        # Sort by combined score
        sorted_results = sorted(
            combined_scores.items(),
            key=lambda x: x[1]["score"],
            reverse=True
        )[:top_k]
        
        return [
            {"id": doc_id, "metadata": data["metadata"], "score": data["score"]}
            for doc_id, data in sorted_results
        ]

    def orchestrated_retrieval(self, embedding: List[float], query: str, top_k: int = 3) -> List[Dict]:
        """
        Orchestration retrieval: intelligently combines multiple strategies
        - Uses hybrid search by default
        - Falls back to semantic if keyword yields no results
        - Deduplicates and ranks results
        """
        # Try hybrid search first (best of both worlds)
        results = self.hybrid_search(embedding, query, top_k=top_k, alpha=0.7)
        
        # If no good results, fall back to pure semantic
        if not results or all(r["score"] < 0.1 for r in results):
            results = self.query(embedding, top_k=top_k)
        
        return results
