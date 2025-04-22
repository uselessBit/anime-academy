from pydantic import BaseModel

class CreateUserSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None


class UpdateUserSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None