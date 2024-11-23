from flask import Blueprint, request, jsonify
from bson import ObjectId
from config import db
import base64
from werkzeug.utils import secure_filename
from datetime import datetime
import os

products = Blueprint('products', __name__)

@products.route('/products', methods=['GET'])
def get_products():
    products_list = list(db.products.find())
    for product in products_list:
        product['_id'] = str(product['_id'])
        if 'id' in product:
            del product['id']
    return jsonify({"products": products_list})

@products.route('/products', methods=['POST'])
def add_product():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
        
    # read image as a bytes and encode it to base64
    if file:
        image_binary = file.read()
        image_base64 = base64.b64encode(image_binary).decode('utf-8')
        product_data = request.form.to_dict()
        product_data['image'] = image_base64
    
    # category & stock validation
    if not product_data.get('category') or not product_data['category'].strip():
        return jsonify({'error': 'Category is required'}), 400
        
    if not product_data.get('stock') or int(product_data['stock']) < 0:
        return jsonify({'error': 'Valid stock number is required'}), 400
        
    product_data['category'] = product_data['category'].strip()
    product_data['price'] = float(product_data['price'])
    product_data['stock'] = int(product_data['stock'])
    product_data['createdAt'] = datetime.utcnow()
    product_data['updatedAt'] = datetime.utcnow()
    
    # add a category if not exists
    existing_category = db.categories.find_one({'name': product_data['category']})
    if not existing_category:
        db.categories.insert_one({
            'name': product_data['category'],
            'createdAt': datetime.utcnow()
        })

    product_data['category'] = product_data['category'].strip()
    product_data['price'] = float(product_data['price'])
    product_data['stock'] = int(product_data['stock'])
    product_data['createdAt'] = datetime.utcnow()
    product_data['updatedAt'] = datetime.utcnow()
    
    try:
        result = db.products.insert_one(product_data)
        product_data['_id'] = str(result.inserted_id)
        return jsonify(product_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@products.route('/products/<id>', methods=['GET'])
def get_product(id):
    product = db.products.find_one({'_id': ObjectId(id)})
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Convert ObjectId to string
    product['_id'] = str(product['_id'])
    
    return jsonify({
        'product': product
    })
