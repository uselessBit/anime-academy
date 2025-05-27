from pydantic import BaseModel


class CreateAnimeSeriesSchema(BaseModel):
    anime_id: int
    episode_number: int
    iframe_html: str


class UpdateAnimeSeriesSchema(BaseModel):
    anime_id: int | None = None
    episode_number: int | None = None
    iframe_html: str | None = None


class AnimeSeriesResponseSchema(BaseModel):
    episode_number: int
    iframe_html: str

    class Config:
        from_attributes = True
