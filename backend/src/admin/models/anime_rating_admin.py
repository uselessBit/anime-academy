from sqladmin import ModelView

from src.clients.database.models.anime_rating import AnimeRating


class AnimeRatingAdmin(ModelView, model=AnimeRating):
    column_list = [
        AnimeRating.id,
        AnimeRating.user_id,
        AnimeRating.anime_id,
        AnimeRating.rating,
        AnimeRating.created_at,
    ]
    name_plural = "Anime Ratings"