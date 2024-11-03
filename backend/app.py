from flask import Flask, jsonify
from flask_cors import CORS
from bson import ObjectId
from config import db
from routes.auth import auth

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth, url_prefix='/auth')

@app.route('/')
def home():
    return jsonify({"message": "Welcome to E-commerce API"})

@app.route('/collections')
def collections():
    return jsonify({"collections": db.list_collection_names()})

@app.route('/products')
def products():
    products = db.products.find()
    product_list = []
    for product in products:
        product['_id'] = str(product['_id'])
        product_list.append(product)
    return jsonify({"products": product_list})

@app.route('/users')
def users():
    user = db.user.find()
    user_list = []
    for user in user:
        user['_id'] = str(user['_id'])
        user_list.append(user)
    return jsonify({"users": user_list})

if __name__ == '__main__':
    app.run(debug=True)