from enum import StrEnum

from pydantic import BaseModel


class AnimeStatus(StrEnum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELED = "canceled"
    DELAYED = "delayed"
    REWATCHING = "rewatching"


class CreateUserFavoriteSchema(BaseModel):
    anime_id: int
    user_id: int
    status: AnimeStatus | None = None


class UpdateUserFavoriteSchema(BaseModel):
    anime_id: int | None = None
    user_id: int | None = None
    status: AnimeStatus | None