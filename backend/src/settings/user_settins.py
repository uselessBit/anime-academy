from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class UserSettings(BaseSettings):
    cookie_secure: bool = False
    secret_key: str = "SECRET_KEY"

    model_config = SettingsConfigDict(env_prefix="user_")
