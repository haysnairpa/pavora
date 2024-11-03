from functools import wraps
from flask import request, jsonify
import jwt
import os

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"message": "Missing token"}), 401
        
        try:
            token = token.split()[1] # to remove the 'Bearer ' prefix
            data = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=["HS256"])
            request.user = data
        except:
            return jsonify({"message": "Invalid token"}), 401
        
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"message": "Missing token"}), 401
        
        try:
            token = token.split()[1]
            data = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=["HS256"])
            if data['role'] != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
        except:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated
