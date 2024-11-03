import os
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
password = os.environ.get("MONGODB_PASSWORD")
SECRET_KEY = os.environ.get("SECRET_KEY")

MONGO_URI = os.environ.get("MONGODB_URI")

client = MongoClient(MONGO_URI, ssl=True)
db = client.testcommerce