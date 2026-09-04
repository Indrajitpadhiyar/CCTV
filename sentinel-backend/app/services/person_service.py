import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.person import Person
from app.repositories.person_repository import PersonRepository
from app.schemas.person import PersonSearchRequest, PersonSearchMatch
from app.ai.model_manager import ai_manager
from app.core.exceptions import NotFoundException


class PersonService:
    def __init__(self, session: AsyncSession):
        self.person_repo = PersonRepository(session)

    async def get_by_id(self, person_id: uuid.UUID) -> Person:
        person = await self.person_repo.get_by_id(person_id)
        if not person:
            raise NotFoundException(resource="Person", identifier=person_id)
        return person

    async def search_similar_persons(self, request: PersonSearchRequest) -> List[PersonSearchMatch]:
        query_embedding = request.embedding
        if not query_embedding:
            # Generate feature vector from uploaded image reference
            query_embedding = await ai_manager.reid.extract_embedding(request.image_base64)

        persons, _ = await self.person_repo.list_persons(
            skip=0,
            limit=200,
            start_time=request.start_time,
            end_time=request.end_time
        )

        matches = []
        for p in persons:
            # Mock candidate embedding comparison
            cand_embedding = await ai_manager.reid.extract_embedding(None)
            sim = await ai_manager.reid.calculate_similarity(query_embedding, cand_embedding)
            if sim >= 0.70:
                matches.append(PersonSearchMatch(
                    person_id=p.id,
                    camera_id=p.camera_id,
                    timestamp=p.timestamp,
                    similarity_score=round(sim, 3),
                    attributes=p.attributes
                ))

        matches.sort(key=lambda x: x.similarity_score, reverse=True)
        return matches[:request.top_k]
