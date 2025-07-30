from app import mongo
from uuid import uuid4

def create_task(user_id, title, description):
    task = {
        "task_id": str(uuid4()),
        "user_id": user_id,
        "title": title,
        "description": description
    }
    mongo.db.tasks.insert_one(task)
    return task["task_id"]

def get_tasks_by_user(user_id):
    tasks = list(mongo.db.tasks.find({"user_id": user_id}))
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

def get_logs_for_user(user_id):
    logs = mongo.db.logs.find({"user_id": user_id})
    return [{"task_id": l["task_id"], "response": l["ai_response"]} for l in logs]

