import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/realm')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'realm')
    JWT_SECRET = os.getenv('JWT_SECRET', 'realm_secret_jwt_key_change_in_production_2026')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 72))
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    PORT = int(os.getenv('PORT', 5000))
