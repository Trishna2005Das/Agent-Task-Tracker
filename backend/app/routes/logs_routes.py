from flask import Blueprint, jsonify, request
from app.utils.jwt_helper import token_required
from app.models.log_model import get_logs_for_user

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/logs", methods=["GET"])
@token_required
def logs():
    logs = get_logs_for_user(request.user_id)
    return jsonify(logs), 200
