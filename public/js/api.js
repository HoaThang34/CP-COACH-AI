// Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

const API_BASE = '/api';

export const API = {
    async generateProblem(topic, difficulty, customRequest) {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, difficulty, customRequest })
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    },

    async analyzeSolution(problem, userCode, language) {
        const response = await fetch(`${API_BASE}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problem, userCode, language })
        });
        return await response.json();
    },

    async requestHint(problem, userCode, currentFeedback) {
        const response = await fetch(`${API_BASE}/hint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problem, userCode, currentFeedback })
        });
        return await response.json();
    },

    async generateSolution(problem, language) {
        const response = await fetch(`${API_BASE}/solution`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problem, language })
        });
        return await response.json();
    },

    async sendChat(history, newMessage, currentContext) {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, newMessage, currentContext })
        });
        return await response.json();
    },

    // Authentication
    async register(username, password) {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    },

    async login(username, password) {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    },

    async logout() {
        const response = await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        return await response.json();
    },

    async checkAuth() {
        const response = await fetch(`${API_BASE}/me`, {
            credentials: 'include'
        });
        return await response.json();
    },

    // History
    async loadHistory() {
        const response = await fetch(`${API_BASE}/history`, {
            credentials: 'include'
        });
        return await response.json();
    },

    async saveHistory(problem, userCode = '', verdict = '', language = 'C++') {
        const response = await fetch(`${API_BASE}/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ problem, userCode, verdict, language })
        });
        return await response.json();
    },

    async updateHistory(historyId, userCode, verdict) {
        const response = await fetch(`${API_BASE}/history/${historyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userCode, verdict })
        });
        return await response.json();
    }
};
