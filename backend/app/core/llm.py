import os
from typing import List, Iterator
import requests
import json

from sentence_transformers import SentenceTransformer

# Configuration
HF_API_TOKEN = os.environ.get("HF_API_TOKEN", "")
HF_INFERENCE_MODEL = os.environ.get("HF_INFERENCE_MODEL", "meta-llama/Llama-3.2-3B-Instruct")
HF_EMB_MODEL = os.environ.get("HF_EMB_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"


class LLM:
    def __init__(self):
        # Lazy load embedder to save memory on startup
        self._embedder = None
        
        # Check if HF token is set
        if not HF_API_TOKEN:
            print("\n" + "="*80)
            print("WARNING: HF_API_TOKEN not set!")
            print("To use Hugging Face Inference API:")
            print("1. Go to https://huggingface.co/settings/tokens")
            print("2. Create a new token (read access)")
            print("3. Set environment variable: HF_API_TOKEN=your_token_here")
            print("4. Restart the backend")
            print("="*80 + "\n")

    @property
    def embedder(self):
        """Lazy load the embedding model"""
        if self._embedder is None:
            print(f"Loading embedding model: {HF_EMB_MODEL}")
            self._embedder = SentenceTransformer(HF_EMB_MODEL)
        return self._embedder
    
    def embed(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for texts"""
        embs = self.embedder.encode(texts, convert_to_numpy=True)
        return [e.tolist() for e in embs]

    def generate(self, prompt: str, max_tokens: int = 512) -> str:
        """Generate text using Hugging Face Inference API (OpenAI-compatible)"""
        if not HF_API_TOKEN:
            return "ERROR: HF_API_TOKEN not set. Please configure your Hugging Face API token."
        
        headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": HF_INFERENCE_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": 0.7,
            "top_p": 0.95
        }
        
        try:
            response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"]
            return str(result)
        except requests.exceptions.RequestException as e:
            return f"ERROR: API request failed - {str(e)}"
        except Exception as e:
            return f"ERROR: {str(e)}"

    def generate_stream(self, prompt: str, max_tokens: int = 512) -> Iterator[str]:
        """Stream text generation using Hugging Face Inference API"""
        if not HF_API_TOKEN:
            yield "ERROR: HF_API_TOKEN not set. Please configure your Hugging Face API token."
            return
        
        headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": HF_INFERENCE_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": 0.7,
            "top_p": 0.95,
            "stream": True
        }
        
        try:
            response = requests.post(
                HF_API_URL, 
                headers=headers, 
                json=payload, 
                stream=True,
                timeout=60
            )
            response.raise_for_status()
            
            # Stream the response (OpenAI format)
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        json_str = line_str[6:].strip()
                        if json_str and json_str != '[DONE]':
                            try:
                                data = json.loads(json_str)
                                if "choices" in data and len(data["choices"]) > 0:
                                    delta = data["choices"][0].get("delta", {})
                                    if "content" in delta:
                                        yield delta["content"]
                            except json.JSONDecodeError:
                                continue
        except requests.exceptions.RequestException as e:
            yield f" [API Error: {str(e)}]"
        except Exception as e:
            yield f" [Error: {str(e)}]"


llm = LLM()
