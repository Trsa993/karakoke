from pydantic import BaseSettings


class Settings(BaseSettings):
    postgres_port: str
    postgres_password: str
    postgres_user: str
    postgres_db: str
    postgres_hostname: str

    jwt_public_key: str
    jwt_private_key: str
    refresh_token_expires_in: int
    access_token_expires_in: int
    jwt_algorithm: str

    google_client_id: str
    google_client_secret: str
    facebook_app_id: str
    facebook_app_secret: str
    last_fm_api_key: str

    secret_key: str

    password_update_db: str

    base_data_path: str

    class Config:
        env_file = ".env"


settings = Settings()
