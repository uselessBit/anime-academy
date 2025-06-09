import logging
import uuid

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin, models
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)
from fastapi_users.password import PasswordHelper
from fastapi.security import OAuth2PasswordRequestForm

from src.clients.database.models.user import User
from src.container import container
from src.settings.user_settins import UserSettings
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

user_settings = UserSettings()

logger = logging.getLogger(__name__)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = user_settings.secret_key
    verification_token_secret = user_settings.secret_key

    async def on_after_register(self, user: User, request: Request | None = None):
        logger.info("User %s has registered.", user.id)

    async def on_after_forgot_password(self, user: User, token: str, request: Request | None = None):
        logger.info("User %s has forgot their password. Reset token: %s", user.id, token)

    async def on_after_request_verify(self, user: User, token: str, request: Request | None = None):
        logger.info("Verification requested for user %s. Verification token: %s", user.id, token)

    async def authenticate(
            self, credentials: OAuth2PasswordRequestForm
    ) -> models.UserProtocol | None:
        user = await self.user_db.get_by_username(credentials.username)
        if not user:
            return None

        password_helper = PasswordHelper()
        verified, _ = password_helper.verify_and_update(
            credentials.password, user.hashed_password
        )
        if not verified:
            return None

        return user


class CustomSQLAlchemyUserDatabase(SQLAlchemyUserDatabase):
    async def get_by_username(self, username: str):
        query = select(self.user_table).where(username == self.user_table.username)
        return await self.session.scalar(query)


async def get_user_db(session: AsyncSession = Depends(container.database_session_no_context())):
    yield CustomSQLAlchemyUserDatabase(session, User)


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


cookie_transport = CookieTransport(
    cookie_max_age=2_592_000, cookie_name="fastapiusersauth", cookie_secure=user_settings.cookie_secure, cookie_samesite="none"
)


def get_jwt_strategy() -> JWTStrategy[models.UP, models.ID]:
    return JWTStrategy(secret=user_settings.secret_key, lifetime_seconds=2_592_000)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])
