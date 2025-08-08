from flask import Blueprint, request, jsonify
from app.utils.jwt_helper import token_required
import os
from dotenv import load_dotenv

from openai import OpenAI  # new client import

load_dotenv()

ai_bp = Blueprint("ai", __name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in environment variables")

client = OpenAI(api_key=OPENAI_API_KEY)

@ai_bp.route("/tasks/<task_id>/run", methods=["POST"])
@token_required
def run_ai(task_id):
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            print("[run_ai] Missing or invalid JSON payload")
            return jsonify({"error": "Invalid or missing JSON payload"}), 400

        user_input = data.get("input", "")
        if not isinstance(user_input, str) or not user_input.strip():
            print("[run_ai] Input text missing or invalid")
            return jsonify({"error": "Input text is required"}), 400

        user_input = user_input.strip()
        print(f"[run_ai] Received task_id={task_id} with input: {user_input[:100]}")

        model_map = {
            "sentiment-analyzer": "gpt-4o-mini",
            "email-classifier": "gpt-4o-mini",
            "response-generator": "gpt-4o-mini",
            "ticket-router": "gpt-4o-mini",
        }
        model_name = model_map.get(task_id, "gpt-4o-mini")
        print(f"[run_ai] Using model: {model_name}")

        prompt = ""
        if task_id == "sentiment-analyzer":
            prompt = f"Analyze the sentiment of the following text:\n\n{user_input}\nSentiment:"
        elif task_id == "email-classifier":
            prompt = f"Classify the following email by category and priority:\n\n{user_input}\nCategory and Priority:"
        elif task_id == "response-generator":
            prompt = f"Generate a customer support response for the following message:\n\n{user_input}\nResponse:"
        elif task_id == "ticket-router":
            prompt = f"Decide the appropriate department to route this ticket to:\n\n{user_input}\nDepartment:"
        else:
            prompt = user_input

        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.7,
        )

        ai_response = response.choices[0].message.content.strip()

        print(f"[run_ai] AI response generated (truncated): {ai_response[:200]}")

        return jsonify({"ai_response": ai_response}), 200

    except Exception as e:
        print(f"[run_ai] Exception occurred: {e}", flush=True)
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
