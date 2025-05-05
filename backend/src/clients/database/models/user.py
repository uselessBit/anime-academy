from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import Mapped, relationship

from src.clients.database.base import Base
from src.clients.database.models.anime_rating import AnimeRating
from src.clients.database.models.user_anime_status import UserAnimeStatus


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    ratings: Mapped[list["AnimeRating"]] = relationship(
        "AnimeRating", back_populates="user", cascade="all, delete-orphan"
    )
    comments: Mapped[list["AnimeComment"]] = relationship(
        "AnimeComment", back_populates="user", cascade="all, delete-orphan"
    )
    user_anime_statuses: Mapped[list["UserAnimeStatus"]] = relationship(
        "UserAnimeStatus", back_populates="user", cascade="all, delete-orphan"
    )
