from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel


class AnimeStatus(StrEnum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELED = "canceled"
    DELAYED = "delayed"
    REWATCHING = "rewatching"


class CreateUserAnimeStatusSchema(BaseModel):
    anime_id: int
    user_id: UUID
    status: AnimeStatus | None = None


class UpdateUserAnimeStatusSchema(BaseModel):
    anime_id: int | None = None
    user_id: UUID | None = None
    status: AnimeStatus | None
