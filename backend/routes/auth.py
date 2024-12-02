from flask import Blueprint, request, jsonify
from models.user import User
import jwt
import os
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import uuid

auth = Blueprint('auth', __name__)

# Configure upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
            "role": user['role'],
            "profileImage": user.get('profileImage')
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

@auth.route('/update-profile-image', methods=['POST'])
@jwt_required()
def update_profile_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400
    
    try:
        # Generate unique filename
        filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save the file
        file.save(filepath)
        
        # Update user profile in database
        current_user_id = get_jwt_identity()
        image_url = f"http://localhost:5000/uploads/{filename}"  # Full URL path to access the image
        
        updated_user = User.update_user(
            current_user_id,
            {"profileImage": image_url}
        )
        
        if not updated_user:
            # If user update fails, delete the uploaded file
            os.remove(filepath)
            return jsonify({"error": "Failed to update user profile"}), 500
            
        return jsonify({
            "message": "Profile image updated successfully",
            "profileImage": image_url
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
