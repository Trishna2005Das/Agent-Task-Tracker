import os
from app import mongo
from langchain.chains import LLMChain
from langchain_community.llms import OpenAI
from langchain.prompts import PromptTemplate

def run_agent_for_task(task_id, user_id):
    task = mongo.db.tasks.find_one({"task_id": task_id, "user_id": user_id})
    if not task:
        return "Task not found."

    try:
        prompt = PromptTemplate(
            input_variables=["title", "description"],
            template="You are a support agent. Task title: {title}. Description: {description}. Provide a concise response."
        )

        llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), temperature=0.5)
        chain = LLMChain(llm=llm, prompt=prompt)

        response = chain.run({
            "title": task["title"],
            "description": task["description"]
        })

        mongo.db.logs.insert_one({
            "task_id": task_id,
            "user_id": user_id,
            "ai_response": response
        })

        return response

    except Exception as e:
        return f"AI generation failed: {str(e)}"
