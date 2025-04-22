from src.clients.database.models.user import User
from fastcrud import FastCRUD, crud_router

from src.container import container
from src.services.user.schemas import CreateUserSchema, UpdateUserSchema

user_crud = FastCRUD(User)

session = container.database_session()

user_router = crud_router(
    session=session,
    model=User,
    create_schema=CreateUserSchema,
    update_schema=UpdateUserSchema,
    crud=user_crud,
    path="/users",
    tags=["Users"],
)