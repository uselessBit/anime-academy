from sqladmin import ModelView

from src.clients.database.models.anime_comment import AnimeComment

class AnimeCommentAdmin(ModelView, model=AnimeComment):
    column_list = [
        AnimeComment.id,
        AnimeComment.user_id,
        AnimeComment.anime_id,
        AnimeComment.parent_id,
        AnimeComment.comment,
        AnimeComment.created_at,
        AnimeComment.level,
    ]
    name_plural = "Anime Comments"