from datetime import datetime

from pydantic import BaseModel, Field

class CreateAnimeReviewSchema(BaseModel):
    user_id: int | None = None
    anime_id: int | None = None
    rating: int | None = Field(..., ge=1, le=10)
    review: str | None = None
    created_at: datetime


class UpdateAnimeReviewSchema(BaseModel):
    user_id: int | None = None
    anime_id: int | None = None
    rating: int | None = Field(..., ge=1, le=10)
    review: str | None = None
    created_at: datetime | None = None