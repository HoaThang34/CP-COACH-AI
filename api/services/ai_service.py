
import os
import json
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from api.prompts import PROMPTS

# Configure API Key
def get_ai_client():
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("API_KEY")
    if not api_key:
        raise ValueError("API Key not found in environment variables")
    genai.configure(api_key=api_key)
    return genai

# Schemas
PROBLEM_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "title": {"type": "STRING"},
        "description": {"type": "STRING"},
        "inputFormat": {"type": "STRING"},
        "outputFormat": {"type": "STRING"},
        "constraints": {"type": "STRING"},
        "examples": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "input": {"type": "STRING"},
                    "output": {"type": "STRING"},
                },
            },
        },
        "topic": {"type": "STRING", "description": "Infer the topic from the problem"},
        "difficulty": {"type": "STRING", "description": "Infer the difficulty level"}
    },
    "required": ["title", "description", "inputFormat", "outputFormat", "constraints", "examples"]
}

SOLUTION_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "explanation": {"type": "STRING", "description": "Detailed Markdown explanation of the algorithm approach."},
        "sampleCode": {"type": "STRING", "description": "Complete, well-commented source code."},
        "complexity": {"type": "STRING", "description": "Time and Space complexity analysis."}
    },
    "required": ["explanation", "sampleCode", "complexity"]
}

def generate_problem(topic: str, difficulty: str, custom_request: str = None):
    get_ai_client()
    user_instruction = PROMPTS.generate_problem_instruction(topic, difficulty, custom_request)
    prompt = PROMPTS.generate_problem(user_instruction)

    model = genai.GenerativeModel(
        model_name='gemini-2.0-flash', # Using stable model alias if preview not avail, or strict name
        system_instruction=PROMPTS.generate_problem_system,
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": PROBLEM_SCHEMA,
        }
    )

    try:
        response = model.generate_content(prompt)
        text = response.text
        data = json.loads(text)
        
        # Fallback if topic/diff missing (though schema enforces it usually)
        if not data.get("topic"): data["topic"] = topic
        if not data.get("difficulty"): data["difficulty"] = difficulty
        
        return data
    except Exception as e:
        print(f"Error generating problem: {e}")
        raise e

def analyze_solution(problem: dict, user_code: str, language: str):
    get_ai_client()
    
    prompt = PROMPTS.analyze_solution(
        problem['title'], 
        problem['description'], 
        problem['constraints'], 
        user_code, 
        language
    )

    model = genai.GenerativeModel(model_name='gemini-2.0-flash-thinking-exp-01-21') # Using thinking model if available or fallback

    try:
        # Note: Thinking models might not support system instructions or JSON mode perfectly yet in all SDK versions,
        # but here we just need text.
        response = model.generate_content(prompt)
        raw_text = response.text
        
        # Parse verdict
        import re
        match = re.search(r'^\[(.*?)\]', raw_text)
        verdict_code = 'UNKNOWN'
        feedback_text = raw_text

        if match:
            verdict_code = match.group(1)
            feedback_text = raw_text[len(match.group(0)):].strip()

        verdict = 'UNKNOWN'
        if 'SAI_HUONG' in verdict_code: verdict = 'WRONG_DIRECTION'
        elif 'THIEU_SOT' in verdict_code: verdict = 'PARTIAL'
        elif 'DUNG' in verdict_code: verdict = 'CORRECT'
        elif 'XUAT_SAC' in verdict_code: verdict = 'EXCELLENT'

        return {
            "verdict": verdict,
            "feedbackMarkdown": feedback_text
        }
    except Exception as e:
        print(f"Error analyzing solution: {e}")
        raise e

def request_hint(problem: dict, user_code: str, current_feedback: str):
    get_ai_client()
    prompt = PROMPTS.request_hint(problem['title'], user_code, current_feedback)
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)
    return response.text

def generate_solution(problem: dict, language: str):
    get_ai_client()
    prompt = PROMPTS.generate_solution(
        problem['title'], 
        problem['description'], 
        problem['constraints'], 
        language
    )

    model = genai.GenerativeModel(
        model_name='gemini-2.0-flash-thinking-exp-01-21',
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": SOLUTION_SCHEMA
        }
    )

    try:
        response = model.generate_content(prompt)
        text = response.text
        return json.loads(text)
    except Exception as e:
        print(f"Error generating solution: {e}")
        raise e

def send_chat_to_tutor(history: list, new_message: str, current_context: str = None):
    get_ai_client()
    
    formatted_history = []
    for msg in history:
        role = "user" if msg['role'] == "user" else "model"
        formatted_history.append({"role": role, "parts": [msg['text']]})

    system_instruction = PROMPTS.chat_system_instruction(current_context)
    
    model = genai.GenerativeModel(
        model_name='gemini-2.0-flash',
        system_instruction=system_instruction
    )
    
    chat = model.start_chat(history=formatted_history)
    response = chat.send_message(new_message)
    return response.text
