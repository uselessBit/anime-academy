from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, relationship

from src.clients.database.models.anime_review import AnimeReview
from src.clients.database.models.user_favorite import UserFavorite
from fastapi_users.db import SQLAlchemyBaseUserTableUUID


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    reviews: Mapped[list["AnimeReview"]] = relationship(
        "AnimeReview", back_populates="user", cascade="all, delete-orphan"
    )
    favorites: Mapped[list["UserFavorite"]] = relationship(
        "UserFavorite", back_populates="user", cascade="all, delete-orphan"
    )