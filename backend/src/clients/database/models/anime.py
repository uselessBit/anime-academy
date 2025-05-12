from sqlalchemy import SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.clients.database.base import Base
from sqlalchemy import ForeignKey


class Anime(Base):
    __tablename__ = "anime"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    release_year: Mapped[int] = mapped_column(SmallInteger, nullable=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    rating: Mapped[float] = mapped_column(nullable=True)

    ratings: Mapped[list["AnimeRating"]] = relationship(back_populates="anime", cascade="all, delete-orphan")
    comments: Mapped[list["AnimeComment"]] = relationship(back_populates="anime", cascade="all, delete-orphan")
    genres: Mapped[list["Genre"]] = relationship(back_populates="anime", secondary="anime_genres")


class AnimeGenre(Base):
    __tablename__ = "anime_genres"

    anime_id: Mapped[int] = mapped_column(ForeignKey("anime.id", ondelete="CASCADE"), primary_key=True)
    genre_id: Mapped[int] = mapped_column(ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True)
