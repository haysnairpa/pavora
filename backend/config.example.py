import os
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

try:
    client = MongoClient(
        os.getenv("MONGO_URI"),
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=20000,
        socketTimeoutMS=20000,
        tlsAllowInvalidCertificates=True
    )
    client.admin.command('ping')
    print("Koneksi MongoDB berhasil!")
    db = client.testcommerce

except Exception as e:
    print(f"Error koneksi MongoDB: {e}")
    raise