from flask import Blueprint, request, jsonify
from bson import ObjectId
from config import db
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
    product_data = request.form.to_dict()
    
    # category validation
    if not product_data.get('category') or not product_data['category'].strip():
        return jsonify({'error': 'Category is required'}), 400
        
    product_data['category'] = product_data['category'].strip()
    product_data['price'] = float(product_data['price'])
    product_data['createdAt'] = datetime.utcnow()
    product_data['updatedAt'] = datetime.utcnow()
    
    # add a category if not exists
    existing_category = db.categories.find_one({'name': product_data['category']})
    if not existing_category:
        db.categories.insert_one({
            'name': product_data['category'],
            'createdAt': datetime.utcnow()
        })

    # handle image upload
    if 'image' in request.files:
        file = request.files['image']
        filename = secure_filename(file.filename)
        file.save(os.path.join('uploads', filename))
        product_data['image'] = f'/uploads/{filename}'

    try:
        result = db.products.insert_one(product_data)
        product_data['_id'] = str(result.inserted_id)
        return jsonify(product_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
