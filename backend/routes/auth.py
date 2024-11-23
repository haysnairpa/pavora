from flask import Blueprint, request, jsonify
from models.user import User
import jwt
import os
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity 

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
    
    # Gunakan flask_jwt_extended untuk generate token
    from flask_jwt_extended import create_access_token
    
    token = create_access_token(identity=str(user['_id']))

    return jsonify({
        "token": token,
        "user": {
            "id": str(user['_id']),
            "username": user['username'],
            "email": user['email'],
            "role": user['role']
        }
    })

@auth.route('/update', methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        updated_user = User.update_user(
            current_user_id, 
            {"username": data.get('username')}
        )
        
        if not updated_user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': str(updated_user['_id']),
                'username': updated_user['username'],
                'email': updated_user['email'],
                'role': updated_user['role']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
