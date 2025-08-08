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
    from bson import ObjectId
    from app import mongo
    logs = mongo.db.logs.find({"user_id": user_id})
    formatted_logs = []

    for log in logs:
        ts = log.get("timestamp")
        if isinstance(ts, datetime):
            ts_str = ts.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(ts, str):
            ts_str = ts
        else:
            ts_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        formatted_logs.append({
            "id": str(log.get("_id", "")),
            "timestamp": ts_str,
            "task": str(log.get("task_id", "Unknown Task")),
            "type": str(log.get("type", "SYSTEM")),
            "status": str(log.get("status", "SUCCESS")),
            "duration": str(log.get("duration", "N/A")),
            "details": str(log.get("ai_response", "")),
            "user": str(log.get("user", "System"))
        })

    return formatted_logs
