from flask import Flask
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

mongo = PyMongo()

def create_app():
    load_dotenv()  # Load env variables
    app = Flask(__name__)
    
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    app.config["JWT_SECRET"] = os.getenv("JWT_SECRET")
    app.config["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    mongo.init_app(app)

    # Import and register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.task_routes import task_bp
    from app.routes.ai_routes import ai_bp
    from app.routes.logs_routes import logs_bp
    from app.routes.profile_routes import profile_bp
    
    app.register_blueprint(profile_bp)

    app.register_blueprint(auth_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(logs_bp)

    return app
