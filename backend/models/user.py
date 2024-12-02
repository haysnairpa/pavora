from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from config import db

class User:
    def __init__(self, username, email, password, role="customer", profileImage=None):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.role = role
        self.profileImage = profileImage
        self.created_at = datetime.now()

    def save(self):
        user_data = {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "role": self.role,
            "profileImage": self.profileImage,
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
    
    @staticmethod
    def update_user(user_id, update_data):
        try:
            result = db.user.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            if result.modified_count:
                return db.user.find_one({"_id": ObjectId(user_id)})
            return None
        except Exception as e:
            print(f"Error updating user: {e}")
            return None
