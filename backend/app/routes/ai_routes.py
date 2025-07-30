from flask import Blueprint, request, jsonify
from app.utils.jwt_helper import token_required
from app.utils.langchain_tools import run_agent_for_task

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/tasks/<task_id>/run", methods=["POST"])
@token_required
def run_ai(task_id):
    ai_response = run_agent_for_task(task_id, request.user_id)
    return jsonify({"ai_response": ai_response}), 200
