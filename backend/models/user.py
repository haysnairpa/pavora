from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from config import db

class User:
    def __init__(self, username, email, password, role="customer"):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.role = role
        self.created_at = datetime.now()

    def save(self):
        user_data = {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "role": self.role,
            "created_at": self.created_at
        }
        result = db.user.insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_email(email):
        return db.user.find_one({"email": email})
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)