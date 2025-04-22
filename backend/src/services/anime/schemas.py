from pydantic import BaseModel

class CreateAnimeSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    rating: float | None = None


class UpdateAnimeSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    rating: float | None = None