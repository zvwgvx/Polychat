from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    # CORS Settings
    allowed_origins: str = "http://localhost:3000,http://localhost:5173"

    # AI API Keys (optional, for when you integrate real AI models)
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]


settings = Settings()
