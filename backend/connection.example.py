from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

try:
    client.admin.command('ping')
    print("Koneksi berhasil!")
except Exception as e:
    print("Koneksi gagal:", e)