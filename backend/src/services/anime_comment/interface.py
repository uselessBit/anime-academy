from abc import abstractmethod
from typing import Protocol

from src.clients.database.models.anime_comment import AnimeComment
from src.services.anime_comment.schemas import CommentTreeResponse, AnimeCommentResponseSchema


class AnimeCommentServiceI(Protocol):
    @abstractmethod
    async def get_comment_tree(self, comment_id: int) -> CommentTreeResponse: ...

    @abstractmethod
    async def get_anime_comments(self, anime_id: int) -> list[AnimeCommentResponseSchema]: ...

    @abstractmethod
    async def _load_replies(self, root_comment: AnimeComment, session) -> CommentTreeResponse: ...

    @staticmethod
    @abstractmethod
    def _build_comment_tree(all_comments: list[AnimeComment], root_id: int) -> CommentTreeResponse: ...
