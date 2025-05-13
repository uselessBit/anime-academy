import json
from enum import StrEnum

from pydantic import BaseModel, model_validator


class CreateAnimeSchema(BaseModel):
    title: str
    description: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    rating: float | None = None
    genre_ids: list[int] | None = None

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data: str) -> dict:
        return json.loads(data)


class AnimeResponseSchema(BaseModel):
    id: int
    title: str
    description: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    rating: float | None = None
    genre_ids: list[int] | None = None

    class Config:
        from_attributes = True


class UpdateAnimeSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    rating: float | None = None
    genre_ids: list[int] | None = None

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data: str) -> dict:
        return json.loads(data)


class SortBy(StrEnum):
    TITLE = "title"
    RELEASE_YEAR = "release_year"
    RATING = "rating"


class Order(StrEnum):
    ASC = "asc"
    DESC = "desc"