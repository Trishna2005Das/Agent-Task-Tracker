from flask import Blueprint, request, jsonify
from app.models.user_model import get_user_by_email, create_user
from app.utils.jwt_helper import generate_jwt_token
from app import mongo
import bcrypt
import uuid

auth_bp = Blueprint("auth", __name__)

#signup using bycrpt for hashing password and uudid4 for creating id instead of mongodbs default objectid
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not all([email, password, name]):
        return jsonify({"error": "Missing fields"}), 400

    existing_user = get_user_by_email(email)
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_id = str(uuid.uuid4())  # generate unique user_id
    create_user(user_id, email, hashed_pw, name)

    return jsonify({"message": "User registered successfully"}), 201

#login using bycrypt
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = get_user_by_email(email)
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_jwt_token(user["user_id"])
    return jsonify({"token": token, "user_id": user["user_id"], "name": user["name"]}), 200
