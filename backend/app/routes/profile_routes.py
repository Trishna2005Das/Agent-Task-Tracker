from flask import Blueprint, jsonify, request
from app.utils.jwt_helper import token_required
from app import mongo

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile", methods=["GET"])
@token_required
def profile():
    user = mongo.db.users.find_one({"user_id": request.user_id}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200
