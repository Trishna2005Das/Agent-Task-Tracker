from app import mongo

def get_user_by_email(email):
    return mongo.db.users.find_one({"email": email})

def get_user_by_id(user_id):
    return mongo.db.users.find_one({"user_id": user_id})

def create_user(user_id, email, hashed_pw, name):
    user = {
        "user_id": user_id,
        "email": email,
        "password": hashed_pw,
        "name": name,
        "role": "user",
        "created_at": mongo.datetime.datetime.utcnow()
    }
    mongo.db.users.insert_one(user)
