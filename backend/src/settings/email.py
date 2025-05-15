from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class EmailSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="email_")
    host: str = "smtp.gmail.com"
    port: str = "465"
    username: str = "info@gmail.com"
    password: SecretStr
