from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class TestDatabaseSettings(BaseSettings):
    host: str = "localhost"
    port: int = 5432
    name: str = "default"
    user: str = "root"
    password: str = "password"
    driver: str = "asyncpg"
    type: str = "postgresql"

    model_config = SettingsConfigDict(env_prefix="test_db_")

    @property
    def url(self) -> str:
        return f"{self.type}+{self.driver}://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"
