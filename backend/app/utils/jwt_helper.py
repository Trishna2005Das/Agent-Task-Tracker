import jwt
import datetime
from flask import current_app, request, jsonify
from functools import wraps

# 🔐 Generate JWT Token
def generate_jwt_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    secret = current_app.config.get("JWT_SECRET", "secret_key")
    return jwt.encode(payload, secret, algorithm="HS256")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            secret = current_app.config.get("JWT_SECRET", "secret_key")
            data = jwt.decode(token, secret, algorithms=["HS256"])
            request.user_id = data["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated
