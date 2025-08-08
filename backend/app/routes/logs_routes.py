from flask import Blueprint, jsonify, g
from app.utils.jwt_helper import token_required
from app.models.log_model import get_logs_for_user

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/logs", methods=["GET"])
@token_required
def logs():
    try:
        # Pull user_id from g instead of request
        user_id = getattr(g, "user_id", None)
        if not user_id:
            return jsonify({"error": "User ID missing from request"}), 401

        logs = get_logs_for_user(user_id)

        if not logs:
            return jsonify({"message": "No logs found"}), 404

        return jsonify(logs), 200

    except Exception as e:
        print(f"Error fetching logs: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
