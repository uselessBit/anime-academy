from abc import abstractmethod
from typing import Protocol

from src.services.anime_comment.schemas import CommentTreeResponse


class AnimeCommentServiceI(Protocol):
    @abstractmethod
    async def get_comment_tree(self, comment_id: int) -> CommentTreeResponse: ...

    @abstractmethod
    async def _get_child_comments(self, comment) -> CommentTreeResponse: ...

