from flask import Blueprint, request, jsonify, g
from app.utils.jwt_helper import token_required
from app import mongo
from datetime import datetime

profile_bp = Blueprint("profile", __name__)

# ---------------- GET Profile ----------------
@profile_bp.route("/", methods=["GET"])
@token_required
def get_profile():
    # Always match user_id as string
    user = mongo.db.users.find_one(
        {"user_id": str(g.user_id)},
        {"_id": 0, "password": 0}
    )

    if not user:
        # Auto-create minimal profile so 404 never happens again
        new_user = {
            "user_id": str(g.user_id),
            "firstName": "",
            "lastName": "",
            "email": "",
            "phone": "",
            "location": "",
            "role": "user",
            "department": "",
            "timezone": "",
            "created_at": datetime.utcnow()
        }
        mongo.db.users.insert_one(new_user)
        user = {k: v for k, v in new_user.items() if k != "password"}

    return jsonify(user), 200


# ---------------- UPDATE Profile ----------------
@profile_bp.route("/", methods=["PUT"])
@token_required
def update_profile():
    data = request.get_json()

    # Fields allowed to update
    allowed_fields = [
        "firstName", "lastName", "email", "phone",
        "location", "role", "department", "timezone"
    ]

    update_data = {field: data[field] for field in allowed_fields if field in data}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    result = mongo.db.users.update_one(
        {"user_id": str(g.user_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "Profile updated successfully"}), 200
