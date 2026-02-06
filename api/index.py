# Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from api.services.ai_service import generate_problem, analyze_solution, request_hint, generate_solution, send_chat_to_tutor
from api.services.auth_service import register_user, login_user, save_history, update_history, load_history
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../public', static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
CORS(app, supports_credentials=True)

@app.route('/')
def serve_welcome():
    return send_from_directory(app.static_folder, 'welcome.html')

@app.route('/app')
def serve_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/generate', methods=['POST'])
def handle_generate():
    data = request.json
    try:
        result = generate_problem(data['topic'], data['difficulty'], data.get('customRequest'))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def handle_analyze():
    data = request.json
    try:
        result = analyze_solution(data['problem'], data['userCode'], data['language'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/hint', methods=['POST'])
def handle_hint():
    data = request.json
    try:
        result = request_hint(data['problem'], data['userCode'], data['currentFeedback'])
        return jsonify({"hint": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/solution', methods=['POST'])
def handle_solution():
    data = request.json
    try:
        result = generate_solution(data['problem'], data['language'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def handle_chat():
    data = request.json
    try:
        result = send_chat_to_tutor(data['history'], data['newMessage'], data.get('currentContext'))
        return jsonify({"text": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Authentication Endpoints ===

@app.route('/api/register', methods=['POST'])
def handle_register():
    data = request.json
    try:
        result = register_user(data['username'], data['password'])
        if result['success']:
            session['user_id'] = result['user_id']
            session['username'] = result['username']
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def handle_login():
    data = request.json
    try:
        result = login_user(data['username'], data['password'])
        if result['success']:
            session['user_id'] = result['user_id']
            session['username'] = result['username']
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def handle_logout():
    session.clear()
    return jsonify({"success": True})

@app.route('/api/me', methods=['GET'])
def handle_me():
    if 'user_id' in session:
        return jsonify({
            "authenticated": True,
            "user_id": session['user_id'],
            "username": session['username']
        })
    return jsonify({"authenticated": False})

# === History Endpoints ===

@app.route('/api/history', methods=['GET'])
def handle_get_history():
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    try:
        result = load_history(session['user_id'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/history', methods=['POST'])
def handle_save_history():
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    data = request.json
    try:
        result = save_history(
            session['user_id'],
            data['problem'],
            data.get('userCode', ''),
            data.get('verdict', ''),
            data.get('language', 'cpp')
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/history/<int:history_id>', methods=['PUT'])
def handle_update_history(history_id):
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    data = request.json
    try:
        result = update_history(
            history_id,
            data.get('userCode', ''),
            data.get('verdict', '')
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3434)
