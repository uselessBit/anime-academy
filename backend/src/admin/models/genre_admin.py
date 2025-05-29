from sqladmin import ModelView

from src.clients.database.models.genre import Genre


class GenreAdmin(ModelView, model=Genre):
    column_list = [
        Genre.id,
        Genre.name,
    ]
    name_plural = "Genres"