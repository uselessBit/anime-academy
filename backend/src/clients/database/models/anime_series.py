from sqlalchemy import Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.clients.database.base import Base
from sqlalchemy import ForeignKey

class AnimeSeries(Base):
    __tablename__ = "anime_series"

    id: Mapped[int] = mapped_column(primary_key=True)
    episode_number: Mapped[int] = mapped_column(Integer, nullable=False)
    iframe_html: Mapped[str] = mapped_column(Text, nullable=False)

    anime_id: Mapped[int] = mapped_column(ForeignKey("anime.id", ondelete="CASCADE"), nullable=False)
    anime: Mapped["Anime"] = relationship(back_populates="series")