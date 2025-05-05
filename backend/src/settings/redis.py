from pydantic_settings import BaseSettings, SettingsConfigDict


class RedisSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="redis_")
    host: str = "localhost"
    port: str = "6379"
    decode_responses: bool = True
    expiration: int = 60
