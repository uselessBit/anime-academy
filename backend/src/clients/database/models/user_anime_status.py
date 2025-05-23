from sqlalchemy import BigInteger, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.clients.database.base import Base
from sqlalchemy.types import UUID as SQLAlchemyUUID


class UserAnimeStatus(Base):
    __tablename__ = "user_anime_statuses"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[str] = mapped_column(String(255), nullable=True)
    anime_id: Mapped[BigInteger] = mapped_column(ForeignKey("anime.id"))
    user_id: Mapped[BigInteger] = mapped_column(SQLAlchemyUUID(as_uuid=True), ForeignKey("users.id"))

    user: Mapped["User"] = relationship(back_populates="user_anime_statuses")
    anime: Mapped["Anime"] = relationship()
