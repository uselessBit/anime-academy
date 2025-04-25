from datetime import datetime

from pydantic import BaseModel

class CreateAnimeReviewSchema(BaseModel):
    user_id: int | None = None
    anime_id: int | None = None
    rating: int | None = None
    review: str | None = None
    created_at: datetime | None = None


class UpdateAnimeReviewSchema(BaseModel):
    user_id: int | None = None
    anime_id: int | None = None
    rating: int | None = None
    review: str | None = None
    created_at: datetime