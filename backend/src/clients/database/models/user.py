from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, String

from src.clients.database.models.anime_review import AnimeReview
from src.clients.database.models.user_favorite import UserFavorite


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(255))
    last_name: Mapped[str] = mapped_column(String(255))
    username: Mapped[str] = mapped_column(String(255))

    reviews: Mapped[list["AnimeReview"]] = relationship(
        "AnimeReview", back_populates="user", cascade="all, delete-orphan"
    )
    favorites: Mapped[list["UserFavorite"]] = relationship(
        "UserFavorite", back_populates="user", cascade="all, delete-orphan"
    )