from sqladmin import ModelView

from src.clients.database.models.anime_series import AnimeSeries


class AnimeSeriesAdmin(ModelView, model=AnimeSeries):
    column_list = [
        AnimeSeries.id,
        AnimeSeries.episode_number,
        AnimeSeries.iframe_html,
    ]
    name_plural = "Anime Series"