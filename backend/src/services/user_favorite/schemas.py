from pydantic import BaseModel

class CreateUserFavoriteSchema(BaseModel):
    anime_id: int | None = None
    user_id: int | None = None


class UpdateUserFavoriteSchema(BaseModel):
    anime_id: int | None = None
    user_id: int | None = None