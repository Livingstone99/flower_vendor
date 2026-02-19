from __future__ import annotations

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://flower:flower@localhost:5432/flower_vendor"
    jwt_secret: str = "dev_change_me"
    jwt_issuer: str = "flower_vendor"
    jwt_audience: str = "flower_vendor_web"
    access_token_expires_minutes: int = 60

    cors_origins: str = "http://localhost:3000"

    google_client_id: str = ""
    facebook_app_id: str = ""
    facebook_app_secret: str = ""
    google_api_key: str = ""
    deepseek_api_key: str = ""
    deepseek_base_url: str = "https://api.deepseek.com"

    auth_insecure_dev_bypass: bool = False

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()




