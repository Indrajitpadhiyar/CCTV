import random
import math
from typing import Any, List, Optional
from app.ai.interfaces import PersonReIDInterface


class PersonReIDService(PersonReIDInterface):
    """Person Re-Identification Feature Embedding & Cosine Similarity Service."""

    def __init__(self, embedding_dim: int = 512):
        self.embedding_dim = embedding_dim

    async def extract_embedding(self, frame: Any, bbox: Optional[List[int]] = None) -> List[float]:
        # Return normalized synthetic feature embedding vector
        vec = [random.gauss(0, 1) for _ in range(self.embedding_dim)]
        norm = math.sqrt(sum(x * x for x in vec))
        return [x / norm for x in vec]

    async def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(embedding1, embedding2))
        norm1 = math.sqrt(sum(a * a for a in embedding1))
        norm2 = math.sqrt(sum(b * b for b in embedding2))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return max(0.0, min(1.0, dot_product / (norm1 * norm2)))
