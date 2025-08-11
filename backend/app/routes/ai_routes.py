# backend/app/routes/ai_routes.py

from flask import Blueprint, jsonify, g
from app.utils.jwt_helper import token_required
from app.models.task_model import get_task_by_id
from app.utils.langchain_tools import run_agent_for_task
from app import mongo
from datetime import datetime

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/tasks/<task_id>/run-ai", methods=["POST"])
@token_required
def run_ai_for_task_route(task_id):
    """
    Run Azure OpenAI agent for a given stored task.
    Updates task status and logs the AI output.
    """
    try:
        user_id = g.user_id

        # ✅ Ensure task exists
        task = get_task_by_id(task_id, user_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404

        # ✅ Set status to running
        mongo.db.tasks.update_one(
            {"task_id": task_id, "user_id": user_id},
            {"$set": {"status": "running", "last_run": datetime.utcnow()}}
        )

        # ✅ Run the AI via langchain_tools
        ai_response = run_agent_for_task(task_id, user_id)

        # ✅ Set status to completed
        mongo.db.tasks.update_one(
            {"task_id": task_id, "user_id": user_id},
            {"$set": {"status": "completed", "progress": 100}}
        )

        return jsonify({
            "message": "AI task run completed",
            "ai_response": ai_response
        }), 200

    except Exception as e:
        # ✅ On failure, mark task as error
        mongo.db.tasks.update_one(
            {"task_id": task_id, "user_id": g.user_id},
            {"$set": {"status": "error"}}
        )
        return jsonify({
            "error": "AI processing failed",
            "details": str(e)
        }), 500
