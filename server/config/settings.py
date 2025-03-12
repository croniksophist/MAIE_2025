"""Configuration management using Pydantic."""

from pydantic import BaseSettings

class Settings(BaseSettings):
    api_key: str
    database_url: str
    debug: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
print(f"API Key Loaded: {settings.api_key}")