
import os
import json
import re
import requests
from api.prompts import PROMPTS

# Ollama Configuration
def get_ollama_config():
    """Get Ollama configuration from environment variables"""
    return {
        'base_url': os.environ.get('OLLAMA_BASE_URL', 'http://localhost:11434'),
        'model_fast': os.environ.get('OLLAMA_MODEL_FAST', 'gemini-3-flash-preview'),
        'model_thinking': os.environ.get('OLLAMA_MODEL_THINKING', 'gemini-3-flash-preview')
    }

def call_ollama_generate(model: str, prompt: str, system: str = None) -> str:
    """
    Call Ollama generate API via REST
    Args:
        model: Model name to use
        prompt: User prompt
        system: Optional system instruction
    Returns:
        Generated text response
    """
    config = get_ollama_config()
    url = f"{config['base_url']}/api/generate"
    
    payload = {
        'model': model,
        'prompt': prompt,
        'stream': False,
        'options': {
            'temperature': 0.7
        }
    }
    
    if system:
        payload['system'] = system
    
    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        return data.get('response', '')
    except requests.exceptions.ConnectionError:
        raise Exception("Không thể kết nối đến Ollama server. Vui lòng kiểm tra Ollama đã được khởi động chưa.")
    except requests.exceptions.Timeout:
        raise Exception("Ollama server phản hồi quá chậm. Vui lòng thử lại.")
    except requests.exceptions.HTTPError as e:
        print(f"Ollama HTTP Error: {e}")
        raise Exception(f"Lỗi từ Ollama server: {str(e)}")
    except Exception as e:
        print(f"Ollama API Error: {e}")
        raise Exception(f"Lỗi khi gọi Ollama: {str(e)}")

def call_ollama_json(model: str, prompt: str, system: str = None, schema_example: dict = None) -> dict:
    """
    Call Ollama and expect JSON response
    Args:
        model: Model name
        prompt: User prompt
        system: Optional system instruction
        schema_example: Example schema to guide the model
    Returns:
        Parsed JSON object
    """
    # Enhance prompt to ensure JSON output
    json_instruction = "\n\nQUAN TRỌNG: Trả về ONLY một JSON object hợp lệ, KHÔNG thêm markdown hoặc text khác."
    
    if schema_example:
        json_instruction += f"\n\nFormat JSON cần tuân thủ:\n{json.dumps(schema_example, indent=2, ensure_ascii=False)}"
    
    full_prompt = prompt + json_instruction
    
    response_text = call_ollama_generate(model, full_prompt, system)
    
    # Clean response - remove markdown code fences if present
    cleaned = response_text.strip()
    if cleaned.startswith('```'):
        # Remove ```json or ``` at start and ``` at end
        cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned)
        cleaned = re.sub(r'\s*```$', '', cleaned)
        cleaned = cleaned.strip()
    
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Raw response: {response_text}")
        raise Exception("AI trả về format không hợp lệ. Vui lòng thử lại.")

def call_ollama_chat(model: str, messages: list) -> str:
    """
    Call Ollama chat API via REST
    Args:
        model: Model name
        messages: List of message dicts with 'role' and 'content'
    Returns:
        Assistant's response text
    """
    config = get_ollama_config()
    url = f"{config['base_url']}/api/chat"
    
    payload = {
        'model': model,
        'messages': messages,
        'stream': False
    }
    
    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        return data.get('message', {}).get('content', '')
    except requests.exceptions.ConnectionError:
        raise Exception("Không thể kết nối đến Ollama server.")
    except requests.exceptions.HTTPError as e:
        print(f"Ollama Chat HTTP Error: {e}")
        raise Exception(f"Lỗi khi chat với AI: {str(e)}")
    except Exception as e:
        print(f"Ollama Chat Error: {e}")
        raise Exception(f"Lỗi khi chat với AI: {str(e)}")

# Schemas for reference
PROBLEM_SCHEMA_EXAMPLE = {
    "title": "Tên bài toán",
    "description": "Mô tả đầy đủ",
    "inputFormat": "Format input",
    "outputFormat": "Format output",
    "constraints": "Ràng buộc",
    "examples": [
        {
            "input": "Input mẫu",
            "output": "Output mẫu"
        }
    ],
    "topic": "Chủ đề",
    "difficulty": "Độ khó"
}

SOLUTION_SCHEMA_EXAMPLE = {
    "explanation": "Giải thích thuật toán bằng Markdown",
    "sampleCode": "Code mẫu đầy đủ",
    "complexity": "Phân tích O(n)"
}

def generate_problem(topic: str, difficulty: str, custom_request: str = None):
    """Generate a competitive programming problem"""
    config = get_ollama_config()
    
    user_instruction = PROMPTS.generate_problem_instruction(topic, difficulty, custom_request)
    prompt = PROMPTS.generate_problem(user_instruction)
    system = PROMPTS.generate_problem_system

    try:
        data = call_ollama_json(
            model=config['model_fast'],
            prompt=prompt,
            system=system,
            schema_example=PROBLEM_SCHEMA_EXAMPLE
        )
        
        # Fallback if topic/difficulty missing
        if not data.get("topic"): 
            data["topic"] = topic
        if not data.get("difficulty"): 
            data["difficulty"] = difficulty
        
        return data
    except Exception as e:
        print(f"Error generating problem: {e}")
        raise e

def analyze_solution(problem: dict, user_code: str, language: str):
    """Analyze user's solution and provide feedback"""
    config = get_ollama_config()
    
    prompt = PROMPTS.analyze_solution(
        problem['title'], 
        problem['description'], 
        problem['constraints'], 
        user_code, 
        language
    )

    try:
        raw_text = call_ollama_generate(
            model=config['model_thinking'],
            prompt=prompt
        )
        
        # Parse verdict
        match = re.search(r'^\[(.*?)\]', raw_text)
        verdict_code = 'UNKNOWN'
        feedback_text = raw_text

        if match:
            verdict_code = match.group(1)
            feedback_text = raw_text[len(match.group(0)):].strip()

        verdict = 'UNKNOWN'
        if 'SAI_HUONG' in verdict_code: 
            verdict = 'WRONG_DIRECTION'
        elif 'THIEU_SOT' in verdict_code: 
            verdict = 'PARTIAL'
        elif 'DUNG' in verdict_code: 
            verdict = 'CORRECT'
        elif 'XUAT_SAC' in verdict_code: 
            verdict = 'EXCELLENT'

        return {
            "verdict": verdict,
            "feedbackMarkdown": feedback_text
        }
    except Exception as e:
        print(f"Error analyzing solution: {e}")
        raise e

def request_hint(problem: dict, user_code: str, current_feedback: str):
    """Provide a hint for the problem"""
    config = get_ollama_config()
    
    prompt = PROMPTS.request_hint(problem['title'], user_code, current_feedback)
    
    response = call_ollama_generate(
        model=config['model_fast'],
        prompt=prompt
    )
    return response

def generate_solution(problem: dict, language: str):
    """Generate a complete solution for the problem"""
    config = get_ollama_config()
    
    prompt = PROMPTS.generate_solution(
        problem['title'], 
        problem['description'], 
        problem['constraints'], 
        language
    )

    try:
        data = call_ollama_json(
            model=config['model_thinking'],
            prompt=prompt,
            schema_example=SOLUTION_SCHEMA_EXAMPLE
        )
        return data
    except Exception as e:
        print(f"Error generating solution: {e}")
        raise e

def send_chat_to_tutor(history: list, new_message: str, current_context: str = None):
    """Chat with AI tutor"""
    config = get_ollama_config()
    
    # Format messages for Ollama
    messages = []
    
    # Add system instruction
    system_instruction = PROMPTS.chat_system_instruction(current_context)
    messages.append({
        'role': 'system',
        'content': system_instruction
    })
    
    # Add chat history
    for msg in history:
        role = 'user' if msg['role'] == 'user' else 'assistant'
        messages.append({
            'role': role,
            'content': msg['text']
        })
    
    # Add new message
    messages.append({
        'role': 'user',
        'content': new_message
    })
    
    response = call_ollama_chat(config['model_fast'], messages)
    return response
