
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
    }
};
