from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.clients.database.base import Base


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    anime: Mapped[list["Anime"]] = relationship(back_populates="genres", secondary="anime_genres")
