from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String
from sqlalchemy.orm import Mapped, relationship, mapped_column

from src.clients.database.base import Base
from src.clients.database.models.anime_rating import AnimeRating
from src.clients.database.models.user_anime_status import UserAnimeStatus


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(
            String(length=320), unique=True, nullable=False
    )

    ratings: Mapped[list["AnimeRating"]] = relationship(
        "AnimeRating", back_populates="user", cascade="all, delete-orphan"
    )
    comments: Mapped[list["AnimeComment"]] = relationship(
        "AnimeComment", back_populates="user", cascade="all, delete-orphan"
    )
    user_anime_statuses: Mapped[list["UserAnimeStatus"]] = relationship(
        "UserAnimeStatus", back_populates="user", cascade="all, delete-orphan"
    )
