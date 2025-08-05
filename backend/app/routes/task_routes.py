from flask import Blueprint, request, jsonify
from app.utils.jwt_helper import token_required
from app.models.task_model import create_task as create_task_db, get_tasks_by_user, get_task_by_id
from app import mongo
from bson import ObjectId
import datetime

task_bp = Blueprint("task", __name__)

# ✅ Create a new task
@task_bp.route("/tasks", methods=["POST"])
@token_required
def create_task():
    try:
        data = request.json
        user_id = request.user_id

        title = data.get("title")
        description = data.get("description")
        status = data.get("status", "pending")

        task_id = create_task_db(user_id, title, description, status)

        return jsonify({"message": "Task created", "task_id": task_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get all tasks (with optional status filter)
@task_bp.route("/tasks", methods=["GET"])
@token_required
def get_tasks():
    try:
        status_filter = request.args.get("status", "all")
        user_id = request.user_id

        tasks = get_tasks_by_user(user_id)
        if status_filter != "all":
            tasks = [task for task in tasks if task.get("status", "") == status_filter]

        return jsonify({"tasks": tasks}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Update a task by ID
@task_bp.route("/tasks/<task_id>", methods=["PUT"])
@token_required
def update_task(task_id):
    try:
        data = request.json
        user_id = request.user_id

        update_data = {
            "title": data.get("title"),
            "description": data.get("description"),
            "status": data.get("status"),
            "updated_at": datetime.datetime.utcnow()
        }

        update_data = {k: v for k, v in update_data.items() if v is not None}

        result = mongo.db.tasks.update_one(
            {"task_id": task_id, "user_id": user_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            return jsonify({"error": "Task not found or no update made"}), 404

        return jsonify({"message": "Task updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Delete a task by ID
@task_bp.route("/tasks/<task_id>", methods=["DELETE"])
@token_required
def delete_task(task_id):
    try:
        user_id = request.user_id

        result = mongo.db.tasks.delete_one({"task_id": task_id, "user_id": user_id})

        if result.deleted_count == 0:
            return jsonify({"error": "Task not found"}), 404

        return jsonify({"message": "Task deleted"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
