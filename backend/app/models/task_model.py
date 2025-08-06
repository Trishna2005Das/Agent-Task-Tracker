from app import mongo
from uuid import uuid4
from datetime import datetime

# ✅ Create a new task with status (default = "pending")
VALID_STATUSES = {"pending", "running", "completed", "error"}

def create_task(user_id, title, description, status="pending", type="General", priority="Medium", schedule="None", notify=False, auto_retry=False):
    if status.lower() not in VALID_STATUSES:
        raise ValueError("Invalid status provided. Must be one of: pending, running, completed, error")

    task = {
        "task_id": str(uuid4()),
        "user_id": user_id,
        "title": title,
        "description": description,
        "status": status.lower(),
        "progress": 0,
        "type": type,
        "priority": priority,
        "schedule": schedule,
        "notify": notify,
        "auto_retry": auto_retry,
        "created_at": datetime.utcnow(),
        "last_run": None,
    }
    mongo.db.tasks.insert_one(task)
    return task["task_id"]


# ✅ Get tasks filtered by user
def get_tasks_by_user(user_id):
    tasks = list(mongo.db.tasks.find({"user_id": user_id}))
    transformed_tasks = []

    for task in tasks:
        transformed_tasks.append({
            "task_id": task.get("task_id", ""),
            "title": task.get("title", ""),
            "description": task.get("description", ""),
            "status": task.get("status", "pending"),
            "progress": task.get("progress", 0),
            "type": task.get("type", "General"),
            "createdAt": task.get("created_at", datetime.utcnow()).strftime("%Y-%m-%d"),
            "lastRun": task.get("last_run").strftime("%Y-%m-%d %H:%M:%S") if task.get("last_run") else "Never"
        })

    return transformed_tasks

def get_task_by_id(task_id, user_id):
    task = mongo.db.tasks.find_one({"task_id": task_id, "user_id": user_id})
    if not task:
        return None

    return {
        "task_id": task.get("task_id", ""),
        "title": task.get("title", ""),
        "description": task.get("description", ""),
        "status": task.get("status", "pending"),
        "progress": task.get("progress", 0),
        "type": task.get("type", "General"),
        "priority": task.get("priority", "Medium"),
        "schedule": task.get("schedule", "None"),
        "notify": task.get("notify", False),
        "auto_retry": task.get("auto_retry", False),
        "createdAt": task.get("created_at", datetime.utcnow()).strftime("%Y-%m-%d"),
        "lastRun": task.get("last_run").strftime("%Y-%m-%d %H:%M:%S") if task.get("last_run") else "Never"
    }

