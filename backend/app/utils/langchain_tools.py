import os
from datetime import datetime
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.openai import OpenAIClient
from langchain.prompts import PromptTemplate
from app import mongo
from pymongo.errors import PyMongoError

load_dotenv()

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")

credential = AzureKeyCredential(AZURE_OPENAI_KEY)
client = OpenAIClient(AZURE_OPENAI_ENDPOINT, credential)

def test_azure_openai():
    response = client.get_chat_completions(
        deployment_id=AZURE_OPENAI_DEPLOYMENT,
        messages=[{"role": "user", "content": "Hello, this is a test."}],
    )
    print(response.choices[0].message.content)

def run_agent_for_task(task_id: str, user_id: str) -> str | None:
    try:
        task = mongo.db.tasks.find_one({"task_id": task_id, "user_id": user_id})
        if not task:
            return None

        prompt = PromptTemplate(
            input_variables=["title", "description"],
            template=(
                "You are a professional support agent.\n"
                "Task title: {title}\n"
                "Description: {description}\n"
                "Provide a concise, professional response."
            ),
        )
        prompt_str = prompt.format(
            title=task.get("title", ""),
            description=task.get("description", ""),
        )

        response = client.get_chat_completions(
            deployment_id=AZURE_OPENAI_DEPLOYMENT,
            messages=[{"role": "user", "content": prompt_str}],
        )
        response_text = response.choices[0].message.content.strip()

        mongo.db.logs.insert_one({
            "task_id": task_id,
            "user_id": user_id,
            "input": {
                "title": task.get("title", ""),
                "description": task.get("description", ""),
            },
            "ai_response": response_text,
            "status": "success",
            "timestamp": datetime.utcnow(),
        })

        return response_text

    except Exception as e:
        error_msg = f"AI processing error: {e}"
        print(error_msg)
        try:
            mongo.db.logs.insert_one({
                "task_id": task_id,
                "user_id": user_id,
                "ai_response": error_msg,
                "status": "error",
                "timestamp": datetime.utcnow(),
            })
        except PyMongoError as log_error:
            print(f"Failed to log error in MongoDB: {log_error}")
        return None

if __name__ == "__main__":
    test_azure_openai()
