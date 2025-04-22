from pydantic import BaseModel

class CreateGenreSchema(BaseModel):
    name: str | None = None


class UpdateGenreSchema(BaseModel):
    name: str | None = None