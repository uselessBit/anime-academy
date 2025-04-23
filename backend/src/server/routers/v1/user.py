from src.clients.database.engine import Database
from src.clients.database.models.user import User
from fastcrud import FastCRUD, crud_router

from src.container import container, DependencyContainer
from src.services.user.schemas import CreateUserSchema, UpdateUserSchema
from fastapi import Depends
from dependency_injector.wiring import Provide, inject

user_crud = FastCRUD(User)

database = Database(container.async_engine())

async def get_session():
    async with database.session() as session:
        yield session

user_router = crud_router(
    session=get_session,
    model=User,
    create_schema=CreateUserSchema,
    update_schema=UpdateUserSchema,
    crud=user_crud,
    path="/users",
    tags=["Users"],
)