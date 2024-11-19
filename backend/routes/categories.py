from flask import Blueprint, request, jsonify
from config import db
from datetime import datetime
import os

categories = Blueprint('categories', __name__)

@categories.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories_list = list(db.categories.find())
        categories_names = set()
        
        for category in categories_list:
            if 'name' in category and category['name'].strip():
                categories_names.add(category['name'])

        products_categories = db.products.distinct('category')
        for category in products_categories:
            if category and category.strip():
                categories_names.add(category)

        return jsonify({"categories": sorted(list(categories_names))})
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return jsonify({"error": "Failed to fetch categories"}), 500

@categories.route('/categories', methods=['POST'])
def add_category():
    try:
        # get category data
        category_data = request.json
        if not category_data or 'name' not in category_data or not category_data['name'].strip():
            return jsonify({"error": "Category name is required"}), 400
            
        category_data['name'] = category_data['name'].strip()
        category_data['createdAt'] = datetime.utcnow()
        
        # check duplicate
        existing = db.categories.find_one({'name': category_data['name']})
        if existing:
            return jsonify({"error": "Category already exists"}), 400
        
        result = db.categories.insert_one(category_data)
        return jsonify({
            "name": category_data['name'],
            "id": str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400