from flask import Blueprint, request, jsonify,g
from app.utils.jwt_helper import token_required
from app.models.task_model import create_task , get_tasks_by_user, get_task_by_id
from app import mongo
from bson import ObjectId
import datetime
from random import randint
from datetime import datetime
task_bp = Blueprint("task", __name__)

# ✅ Create a new task
@task_bp.route("/tasks", methods=["POST"])
@token_required
def create_task_route():
    try:
        data = request.get_json()
        user_id = g.user_id

        title = data.get("title")
        description = data.get("description", "")
        status = data.get("status", "pending")
        type_ = data.get("type", "General")
        priority = data.get("priority", "Medium")
        schedule = data.get("schedule", "None")
        notify = data.get("notify", False)
        auto_retry = data.get("auto_retry", False)

        if not title:
            return jsonify({"error": "Task title is required"}), 400

        task_id = create_task(
            user_id=user_id,
            title=title,
            description=description,
            status=status,
            type=type_,
            priority=priority,
            schedule=schedule,
            notify=notify,
            auto_retry=auto_retry
        )

        return jsonify({"message": "Task created", "task_id": task_id}), 201

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


# ✅ Get all tasks (with optional status filter)

@task_bp.route("/tasks", methods=["GET"])
@token_required
def get_tasks():
    try:
        status_filter = request.args.get("status", "all")
        user_id = g.user_id

        tasks = get_tasks_by_user(user_id)

        transformed_tasks = []
        for task in tasks:
            transformed_tasks.append({
                "task_id": str(task["_id"]),
                "title": task.get("title", ""),
                "description": task.get("description", ""),
                "status": task.get("status", "Pending"),
                "progress": randint(0, 100),
                "type": task.get("type", "Classification"),  # default placeholder
                "createdAt": task.get("created_at", datetime.utcnow()).strftime("%Y-%m-%d"),
                "lastRun": "2 hours ago",  # optional placeholder
            })

        if status_filter != "all":
            transformed_tasks = [t for t in transformed_tasks if t["status"] == status_filter]

        return jsonify({"tasks": transformed_tasks}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




# ✅ Update a task by ID
@task_bp.route("/tasks/<task_id>", methods=["PUT"])
@token_required
def update_task(task_id):
    try:
        data = request.json
        user_id = g.user_id

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
        user_id = g.user_id

        result = mongo.db.tasks.delete_one({"task_id": task_id, "user_id": user_id})

        if result.deleted_count == 0:
            return jsonify({"error": "Task not found"}), 404

        return jsonify({"message": "Task deleted"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
