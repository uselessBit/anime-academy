from sqladmin import ModelView

from src.clients.database.models.user_anime_status import UserAnimeStatus


class UserAnimeStatusAdmin(ModelView, model=UserAnimeStatus):
    column_list = [
        UserAnimeStatus.id,
        UserAnimeStatus.status,
        UserAnimeStatus.anime_id,
        UserAnimeStatus.user_id,
    ]
    name_plural = "User Anime Statuses"