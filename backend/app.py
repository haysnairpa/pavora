from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from bson import ObjectId
from config import db
from routes.auth import auth
from routes.categories import categories
from routes.products import products
import os

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

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