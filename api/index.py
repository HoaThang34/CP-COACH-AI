
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from api.services.ai_service import generate_problem, analyze_solution, request_hint, generate_solution, send_chat_to_tutor
import os

app = Flask(__name__, static_folder='../public', static_url_path='')
CORS(app)

@app.route('/')
def serve_index():
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

if __name__ == '__main__':
    app.run(debug=True, port=3000)
