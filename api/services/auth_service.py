# Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

import sqlite3
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DATABASE_PATH = 'database.db'

def get_db_connection():
    """Create a database connection."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize the database with required tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            problem_data TEXT NOT NULL,
            user_code TEXT,
            verdict TEXT,
            language TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()

def register_user(username, password):
    """Register a new user."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        password_hash = generate_password_hash(password)
        cursor.execute(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            (username, password_hash)
        )
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        return {'success': True, 'user_id': user_id, 'username': username}
    except sqlite3.IntegrityError:
        return {'success': False, 'error': 'Username already exists'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def login_user(username, password):
    """Authenticate a user."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()
        
        if user and check_password_hash(user['password_hash'], password):
            return {
                'success': True,
                'user_id': user['id'],
                'username': user['username']
            }
        else:
            return {'success': False, 'error': 'Invalid username or password'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def save_history(user_id, problem_data, user_code='', verdict='', language='cpp'):
    """Save a problem attempt to history."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        problem_json = json.dumps(problem_data)
        cursor.execute(
            '''INSERT INTO history (user_id, problem_data, user_code, verdict, language)
               VALUES (?, ?, ?, ?, ?)''',
            (user_id, problem_json, user_code, verdict, language)
        )
        
        conn.commit()
        history_id = cursor.lastrowid
        conn.close()
        
        return {'success': True, 'id': history_id}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def update_history(history_id, user_code, verdict):
    """Update an existing history entry with code and verdict."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'UPDATE history SET user_code = ?, verdict = ? WHERE id = ?',
            (user_code, verdict, history_id)
        )
        
        conn.commit()
        conn.close()
        
        return {'success': True}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def load_history(user_id):
    """Load all history for a user."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            '''SELECT id, problem_data, user_code, verdict, language, timestamp
               FROM history WHERE user_id = ? ORDER BY timestamp DESC''',
            (user_id,)
        )
        
        rows = cursor.fetchall()
        conn.close()
        
        history = []
        for row in rows:
            history.append({
                'id': row['id'],
                'problem': json.loads(row['problem_data']),
                'userCode': row['user_code'],
                'verdict': row['verdict'],
                'language': row['language'],
                'timestamp': row['timestamp']
            })
        
        return {'success': True, 'history': history}
    except Exception as e:
        return {'success': False, 'error': str(e)}

# Initialize database on import
init_database()
