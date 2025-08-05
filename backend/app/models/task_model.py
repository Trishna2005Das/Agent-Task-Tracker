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
    for task in tasks:
        task["_id"] = str(task["_id"])
        task["created_at"] = task.get("created_at", "").strftime("%Y-%m-%d %H:%M:%S") if task.get("created_at") else ""
        task["last_run"] = task.get("last_run", "")
    return tasks

# ✅ Get a single task
def get_task_by_id(task_id, user_id):
    task = mongo.db.tasks.find_one({"task_id": task_id, "user_id": user_id})
    if task:
        task["_id"] = str(task["_id"])
        task["created_at"] = task.get("created_at", "").strftime("%Y-%m-%d %H:%M:%S") if task.get("created_at") else ""
        task["last_run"] = task.get("last_run", "")
    return task
