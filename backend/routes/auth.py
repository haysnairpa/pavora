from flask import Blueprint, request, jsonify
from models.user import User
import jwt
import os
from datetime import datetime, timedelta

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.find_by_email(data['email']):
        return jsonify({"error": "Email already used"}), 400

    user = User(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )

    user.save()
    return jsonify({"message": "User created successfully!"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.find_by_email(data['email'])

    if not user or not User.verify_password(user['password'], data['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = jwt.encode({
        "user_id": str(user['_id']),
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(days=1)
    }, os.environ.get('SECRET_KEY'))

    return jsonify({
        "token": token,
        "user": {
            "id": str(user['_id']),
            "username": user['username'],
            "email": user['email'],
            "role": user['role']
        }
    })
