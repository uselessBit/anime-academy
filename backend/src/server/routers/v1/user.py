from src.clients.database.models.user import User
from fastcrud import FastCRUD, crud_router

from src.clients.database.utils import get_session
from src.services.user.schemas import CreateUserSchema, UpdateUserSchema

user_crud = FastCRUD(User)


user_router = crud_router(
    session=get_session,
    model=User,
    create_schema=CreateUserSchema,
    update_schema=UpdateUserSchema,
    crud=user_crud,
    path="/users",
    tags=["Users"],
)