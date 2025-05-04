from datetime import datetime
from uuid import UUID

from pydantic import BaseModel



class CreateAnimeCommentSchema(BaseModel):
    user_id: UUID
    anime_id: int
    parent_id: int | None = None
    comment: str
    created_at: datetime
    level: int = 0


class UpdateAnimeCommentSchema(BaseModel):
    user_id: UUID | None = None
    anime_id: int | None = None
    parent_id: int | None = None
    comment: str | None = None
    created_at: datetime | None = None
    level: int | None = 0


class CommentTreeResponse(BaseModel):
    user_id: UUID
    anime_id: int
    parent_id: int | None = None
    comment: str
    created_at: datetime
    level: int = 0
    replies: list["CommentTreeResponse"] | None