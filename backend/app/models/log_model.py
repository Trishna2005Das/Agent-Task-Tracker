from app import mongo
from datetime import datetime

def log_ai_response(user_id, task_id, ai_response):
    mongo.db.logs.insert_one({
        "user_id": user_id,
        "task_id": task_id,
        "ai_response": ai_response,
        "timestamp": datetime.utcnow()
    })

def get_logs_for_user(user_id):
    logs = mongo.db.logs.find({"user_id": user_id})
    return [{"task_id": log["task_id"], "response": log["ai_response"]} for log in logs]
