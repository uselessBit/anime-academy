from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, String, SmallInteger, DateTime, ForeignKey, func

class AnimeReview(Base):
    __tablename__ = "anime_reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[BigInteger] = mapped_column(ForeignKey("users.id"))
    anime_id: Mapped[BigInteger] = mapped_column(ForeignKey("anime.id"))
    rating: Mapped[int] = mapped_column(SmallInteger)
    review: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="reviews")
    anime: Mapped["Anime"] = relationship("Anime", back_populates="reviews")