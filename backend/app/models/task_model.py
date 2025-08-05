from app import mongo
from uuid import uuid4
from datetime import datetime

# ✅ Create a new task with status (default = "pending")
def create_task(user_id, title, description, status="pending"):
    task = {
        "task_id": str(uuid4()),
        "user_id": user_id,
        "title": title,
        "description": description,
        "status": status.lower(),  # normalize
        "progress": 0,
        "type": "General",
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
