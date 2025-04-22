from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, ForeignKey

class AnimeGenre(Base):
    __tablename__ = "anime_genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    anime_id: Mapped[BigInteger] = mapped_column(ForeignKey("anime.id"))
    genre_id: Mapped[BigInteger] = mapped_column(ForeignKey("genres.id"))

    anime: Mapped["Anime"] = relationship(back_populates="genres")
    genre: Mapped["Genre"] = relationship(back_populates="anime_genres")