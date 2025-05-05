import json

from pydantic import BaseModel, model_validator


class CreateAnimeSchema(BaseModel):
    title: str
    description: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    rating: float | None = None

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data: str) -> dict:
        return json.loads(data)


class UpdateAnimeSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    rating: float | None = None

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data: str) -> dict:
        return json.loads(data)
