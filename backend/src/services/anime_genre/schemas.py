from pydantic import BaseModel

class CreateAnimeGenreSchema(BaseModel):
    anime_id: int | None = None
    genre_id: int | None = None


class UpdateAnimeGenreSchema(BaseModel):
    anime_id: int | None = None
    genre_id: int | None = None