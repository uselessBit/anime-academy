from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, SmallInteger

from src.clients.database.models.anime_genre import AnimeGenre


class Anime(Base):
    __tablename__ = "anime"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    release_year: Mapped[int] = mapped_column(SmallInteger, nullable=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    rating: Mapped[float] = mapped_column(nullable=True)

    reviews: Mapped[list["AnimeReview"]] = relationship(
        back_populates="anime", cascade="all, delete-orphan"
    )
    genres: Mapped[list["AnimeGenre"]] = relationship(
        back_populates="anime", cascade="all, delete-orphan"
    )