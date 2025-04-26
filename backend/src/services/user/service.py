import logging
import uuid
from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin, models
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)

from src.clients.database.models.user import User
from fastapi_users.db import SQLAlchemyUserDatabase

from src.clients.database.utils import get_user_db
from src.settings.user_settins import UserSettings

user_settings = UserSettings()

logger = logging.getLogger(__name__)

class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = user_settings.secret_key
    verification_token_secret = user_settings.secret_key

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        logger.info("User %s has registered.", user.id)

    async def on_after_forgot_password(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        logger.info("User %s has forgot their password. Reset token: %s", user.id, token)

    async def on_after_request_verify(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        logger.info("Verification requested for user %s. Verification token: %s", user.id, token)


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


cookie_transport = CookieTransport(cookie_max_age=3600, cookie_name="fastapiusersauth",
                                   cookie_secure=user_settings.cookie_secure)


def get_jwt_strategy() -> JWTStrategy[models.UP, models.ID]:
    return JWTStrategy(secret=user_settings.secret_key, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)