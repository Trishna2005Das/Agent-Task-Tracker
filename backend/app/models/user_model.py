from app import mongo

def get_user_by_email(email):
    return mongo.db.users.find_one({"email": email})

def create_user(user_id, email, hashed_pw, name):
    user = {
        "user_id": user_id,
        "email": email,
        "password": hashed_pw,
        "name": name,
        "role": "user",
    }
    mongo.db.users.insert_one(user)
