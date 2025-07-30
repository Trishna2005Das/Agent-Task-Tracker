from flask import Blueprint, request, jsonify
from app.utils.jwt_helper import token_required
from app.models.task_model import create_task, get_tasks_by_user

task_bp = Blueprint("tasks", __name__)

# ✅ Create Task
@task_bp.route("/tasks", methods=["POST"])
@token_required
def create():
    data = request.json
    title = data.get("title")
    description = data.get("description")

    if not title or not description:
        return jsonify({"error": "Missing fields"}), 400

    task_id = create_task(request.user_id, title, description)
    return jsonify({"message": "Task created", "task_id": task_id}), 201

# ✅ Get User's Tasks
@task_bp.route("/tasks", methods=["GET"])
@token_required
def list_tasks():
    tasks = get_tasks_by_user(request.user_id)
    return jsonify(tasks), 200
