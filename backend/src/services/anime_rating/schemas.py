from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

class CreateAnimeRatingSchema(BaseModel):
    user_id: UUID | None = None
    anime_id: int | None = None
    rating: int | None = Field(..., ge=1, le=10)
    created_at: datetime


class UpdateAnimeRatingSchema(BaseModel):
    user_id: UUID | None = None
    anime_id: int | None = None
    rating: int | None = Field(..., ge=1, le=10)
    created_at: datetime | None = None