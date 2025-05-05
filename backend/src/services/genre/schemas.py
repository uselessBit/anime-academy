from pydantic import BaseModel


class CreateGenreSchema(BaseModel):
    name: str


class UpdateGenreSchema(BaseModel):
    name: str | None = None
