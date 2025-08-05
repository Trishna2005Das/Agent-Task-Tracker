import jwt
import datetime
from flask import current_app, request, jsonify
from functools import wraps

# 🔐 Generate JWT Token
def generate_jwt_token(user_id: str) -> str:
    """
    Generates a JWT token with user_id and 24-hour expiration.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    secret = current_app.config.get("JWT_SECRET", "default_secret_key")
    token = jwt.encode(payload, secret, algorithm="HS256")

    # For PyJWT ≥ 2.0, jwt.encode returns a str (not bytes), so no decoding needed
    return token

# 🔒 Token Verification Decorator
def token_required(f):
    """
    Decorator to protect routes with JWT token validation.
    Extracts user_id and attaches it to request context.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Token missing"}), 401

        token = auth_header.strip()

        try:
            secret = current_app.config.get("JWT_SECRET", "default_secret_key")
            decoded = jwt.decode(token, secret, algorithms=["HS256"])
            request.user_id = decoded["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated
