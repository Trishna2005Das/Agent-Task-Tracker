import jwt
import datetime
from flask import current_app, request, jsonify,g
from functools import wraps

__all__ = ["generate_jwt_token", "token_required"]

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
    print("🔐 [generate_jwt_token] JWT_SECRET:", secret)
    return jwt.encode(payload, secret, algorithm="HS256")

# 🔒 Token Verification Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            print("❌ Authorization header missing or malformed")
            return jsonify({"error": "Authorization header must start with 'Bearer'"}), 401

        token = auth_header.split("Bearer ")[1].strip()

        try:
            secret = current_app.config.get("JWT_SECRET", "default_secret_key")
            print("🔑 JWT_SECRET:", secret)  # Log the secret used
            print("🪪 Received Token:", token)  # Log the token received

            decoded = jwt.decode(token, secret, algorithms=["HS256"])
            print("✅ Token Decoded:", decoded)

            g.user_id = decoded.get("user_id")  # Save user ID globally
        except jwt.ExpiredSignatureError:
            print("❌ Token has expired")
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            print("❌ Invalid token:", str(e))
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            print("❌ Unexpected error:", str(e))
            return jsonify({"error": f"Token verification failed: {str(e)}"}), 401

        return f(*args, **kwargs)
    return decorated