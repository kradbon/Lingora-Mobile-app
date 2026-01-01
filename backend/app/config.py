from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "lingora-api"
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/lingora"
    )
    secret_key: str = Field(default="change-me")
    access_token_exp_minutes: int = Field(default=60 * 24 * 7, validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    allowed_origins: str = Field(default="*")
    environment: str = Field(default="local")

    seed_demo_user: bool = Field(default=False, validation_alias="SEED_DEMO_USER")
    demo_name: str = Field(default="Demo User", validation_alias="DEMO_NAME")
    demo_email: str = Field(default="demo@example.com", validation_alias="DEMO_EMAIL")
    demo_password: str = Field(default="demo1234", validation_alias="DEMO_PASSWORD")

    admin_enabled: bool = Field(default=True, validation_alias="ADMIN_ENABLED")
    admin_name: str = Field(default="Lingora Admin", validation_alias="ADMIN_NAME")
    admin_email: str = Field(default="admin@example.com", validation_alias="ADMIN_EMAIL")
    admin_password: str = Field(default="admin1234", validation_alias="ADMIN_PASSWORD")
    admin_token_exp_minutes: int = Field(default=60 * 24, validation_alias="ADMIN_TOKEN_EXPIRE_MINUTES")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    @property
    def allowed_origins_list(self) -> list[str]:
        if not self.allowed_origins:
            return ["*"]
        raw = self.allowed_origins.strip()
        if raw == "*":
            return ["*"]
        return [origin.strip() for origin in raw.split(",") if origin.strip()]


settings = Settings()
