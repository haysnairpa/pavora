from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from bson import ObjectId
from config import db
from routes.auth import auth
from routes.categories import categories
from routes.products import products
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
        "supports_credentials": True
    }
})

jwt = JWTManager(app)

# app.static_folder = 'uploads'
# app.static_url_path = '/uploads'

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(categories, url_prefix='/categories')
app.register_blueprint(products, url_prefix='/products')

@app.route('/')
def home():
    return jsonify({"message": "Welcome to E-commerce API"})

@app.route('/collections')
def collections():
    return jsonify({"collections": db.list_collection_names()})

@app.route('/users')
def users():
    user = db.user.find()
    user_list = []
    for user in user:
        user['_id'] = str(user['_id'])
        user_list.append(user)
    return jsonify({"users": user_list})

@app.route('/uploads/<path:filename>')
def serve_image(filename):
    return send_from_directory('uploads', filename, as_attachment=False)

@app.after_request
def after_request(response):
    if not request.path.startswith('/uploads'): 
        response.headers['Content-Type'] = 'application/json'
    return response

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    app.run(debug=True)