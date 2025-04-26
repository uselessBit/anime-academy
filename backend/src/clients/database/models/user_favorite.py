from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, ForeignKey, String

class UserFavorite(Base):
    __tablename__ = "user_favorites"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[str] = mapped_column(String(255), nullable=True)
    anime_id: Mapped[BigInteger] = mapped_column(ForeignKey("anime.id"))
    user_id: Mapped[BigInteger] = mapped_column(ForeignKey("users.id"))

    user: Mapped["User"] = relationship(back_populates="favorites")
    anime: Mapped["Anime"] = relationship()