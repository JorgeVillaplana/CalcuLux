from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ESIOS_TOKEN: str  # Token API e-sios
    FRONTEND_URL: str = "https://calculux.vercel.app"
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()