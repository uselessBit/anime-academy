from sqladmin import ModelView
from src.clients.database.models.anime import Anime

class AnimeAdmin(ModelView, model=Anime):
    column_list = [
        Anime.id,
        Anime.title,
        Anime.image_url,
        Anime.rating,
        Anime.type,
        Anime.episodes,
        Anime.status,
        Anime.source,
        Anime.season,
        Anime.release_year,
        Anime.studio,
        Anime.mpaa_rating,
        Anime.age_restrictions,
        Anime.poster_url,

    ]
    name_plural = "Anime"
