from pydantic import BaseSettings


class Settings(BaseSettings):
    database_port: str
    database_password: str
    database_username: str
    database_name: str
    database_hostname: str

    jwt_public_key: str
    jwt_private_key: str
    refresh_token_expires_in: int
    access_token_expires_in: int
    jwt_algorithm: str

    google_client_id: str
    google_client_secret: str
    facebook_app_id: str
    facebook_app_secret: str

    secret_key: str

    class Config:
        env_file = ".env"


settings = Settings()
