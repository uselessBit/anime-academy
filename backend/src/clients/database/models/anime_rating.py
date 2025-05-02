from datetime import datetime

from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, String, SmallInteger, DateTime, ForeignKey, func

from src.clients.database.models.anime import Anime


class AnimeRating(Base):
    __tablename__ = "anime_rating"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[BigInteger] = mapped_column(ForeignKey("users.id"))
    anime_id: Mapped[BigInteger] = mapped_column(ForeignKey("anime.id"))
    rating: Mapped[int] = mapped_column(SmallInteger)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="ratings")
    anime: Mapped["Anime"] = relationship("Anime", back_populates="ratings")