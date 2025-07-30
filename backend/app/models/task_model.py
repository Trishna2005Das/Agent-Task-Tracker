from app import mongo
from uuid import uuid4

def create_task(user_id, title, description):
    task = {
        "task_id": str(uuid4()),
        "user_id": user_id,
        "title": title,
        "description": description,
        "created_at": mongo.datetime.datetime.utcnow(),
        "status": "pending"
    }
    mongo.db.tasks.insert_one(task)
    return task["task_id"]

def get_tasks_by_user(user_id):
    tasks = list(mongo.db.tasks.find({"user_id": user_id}))
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

def get_task_by_id(task_id, user_id):
    return mongo.db.tasks.find_one({"task_id": task_id, "user_id": user_id})
