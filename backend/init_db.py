from config import db

# Create collections with schema validation
db.create_collection("products", {
   'validator': {
      '$jsonSchema': {
         'bsonType': 'object',
         'required': ['name', 'price', 'category'],
         'properties': {
            'name': {
               'bsonType': 'string',
               'description': 'must be a string and is required'
            },
            'description': {
               'bsonType': 'string',
               'description': 'must be a string if the field exists'
            },
            'price': {
               'bsonType': 'number',
               'description': 'must be a number and is required'
            },
            'category': {
               'bsonType': 'string',
               'description': 'must be a string and is required'
            },
            'image': {
               'bsonType': 'string',
               'description': 'must be a string if the field exists'
            },
            'rating': {
               'bsonType': 'number',
               'minimum': 0,
               'maximum': 5,
               'description': 'must be a number between 0 and 5'
            },
            'createdAt': {
               'bsonType': 'date',
               'description': 'must be a date'
            },
            'updatedAt': {
               'bsonType': 'date',
               'description': 'must be a date'
            }
         }
      }
   }
})

db.create_collection("categories", {
   'validator': {
      '$jsonSchema': {
         'bsonType': 'object',
         'required': ['name'],
         'properties': {
            'name': {
               'bsonType': 'string',
               'description': 'must be a string and is required'
            },
            'createdAt': {
               'bsonType': 'date',
               'description': 'must be a date'
            }
         }
      }
   }
})

print("Collections created successfully!")