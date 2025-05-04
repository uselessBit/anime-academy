from datetime import datetime
from uuid import UUID

from src.clients.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, String, SmallInteger, DateTime, ForeignKey, func
from sqlalchemy.types import UUID as SQLAlchemyUUID
from src.clients.database.models.anime import Anime


class AnimeComment(Base):
    __tablename__ = "anime_comments"
    __mapper_args__ = {
        "batch": False
    }

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(SQLAlchemyUUID(as_uuid=True), ForeignKey("users.id"))
    anime_id: Mapped[int] = mapped_column(ForeignKey("anime.id"))
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("anime_comments.id"), nullable=True
    )
    comment: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    level: Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship("User", back_populates="comments")
    anime: Mapped["Anime"] = relationship("Anime", back_populates="comments")
    replies: Mapped[list["AnimeComment"]] = relationship(
        "AnimeComment",
        back_populates="parent",
        cascade="all, delete-orphan",
        remote_side=[id],
        single_parent=True,
    )
    parent: Mapped["AnimeComment | None"] = relationship(
        "AnimeComment", back_populates="replies", remote_side=[parent_id]
    )