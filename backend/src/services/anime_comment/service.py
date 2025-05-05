from sqlalchemy import select

from src.clients.database.models.anime_comment import AnimeComment
from src.services.anime_comment.interface import AnimeCommentServiceI
from src.services.anime_comment.schemas import CommentTreeResponse
from src.services.base import BaseService
from src.services.errors import CommentNotFoundError


class AnimeCommentService(BaseService, AnimeCommentServiceI):
    async def get_comment_tree(self, comment_id: int) -> CommentTreeResponse:
        async with self.session() as session:
            query = select(AnimeComment).where(AnimeComment.id == comment_id)
            result = await session.execute(query)
            root_comment = result.scalar_one_or_none()
            if not root_comment:
                raise CommentNotFoundError
            return await self._load_replies(root_comment, session)

    async def _load_replies(self, root_comment: AnimeComment, session) -> CommentTreeResponse:
        query = select(AnimeComment).where(AnimeComment.anime_id == root_comment.anime_id)
        result = await session.execute(query)
        comments = result.scalars().all()

        return self._build_comment_tree(comments, root_comment.id)

    @staticmethod
    def _build_comment_tree(comments: list[AnimeComment], root_id: int) -> CommentTreeResponse:
        tree_map: dict[int, CommentTreeResponse] = {}
        children_map: dict[int, list[CommentTreeResponse]] = {}

        for comment in comments:
            tree_map[comment.id] = CommentTreeResponse(
                user_id=comment.user_id,
                anime_id=comment.anime_id,
                parent_id=comment.parent_id,
                comment=comment.comment,
                created_at=comment.created_at,
                level=comment.level,
                replies=[],
            )
            if comment.parent_id is not None:
                children_map.setdefault(comment.parent_id, []).append(tree_map[comment.id])

        for comment_id, comment_response in tree_map.items():
            comment_response.replies = children_map.get(comment_id, [])

        return tree_map[root_id]
