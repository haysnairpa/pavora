from flask import Flask, jsonify
from flask_cors import CORS
from bson import ObjectId
from config import db
from routes.auth import auth
from routes.categories import categories
from routes.products import products

app = Flask(__name__)
CORS(app)

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

@app.after_request
def after_request(response):
    response.headers['Content-Type'] = 'application/json'
    return response

if __name__ == '__main__':
    app.run(debug=True)