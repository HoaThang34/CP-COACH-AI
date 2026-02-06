// Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

import { state, Difficulty } from './state.js';
import { API } from './api.js';
import { UI } from './ui.js';
import { AuthManager } from './auth.js';
import { initResizePanels } from './resize.js';

let authManager;
let currentHistoryId = null; // Track current problem's history ID

function init() {
    authManager = new AuthManager();
    UI.initIcons();
    initResizePanels(); // Initialize resizable panels
    setupEventListeners();
    updateUI();

    // Listen for auth changes to reload history
    window.addEventListener('auth-changed', loadHistoryFromDB);
}

function updateUI() {
    UI.setMode(state.config.mode);
    UI.renderDifficultyOptions(state.config.difficulty, 'difficulty-options', setDifficulty);
    UI.renderDifficultyOptions(state.config.difficulty, 'difficulty-options-custom', setDifficulty);
    UI.renderHistory(state.history, loadHistoryItem);
    UI.renderProblem(state.problem);
    UI.setEditorLang(state.config.language);
    UI.toggleButtons(!!state.problem);
    UI.renderFeedback(state.analysis);
}

function setupEventListeners() {
    // Mode Selector Popup Toggle
    const modeSelectorBtn = document.getElementById('mode-selector-btn');
    const modePopup = document.getElementById('mode-popup');

    if (modeSelectorBtn && modePopup) {
        modeSelectorBtn.onclick = (e) => {
            e.stopPropagation();
            modePopup.classList.toggle('hidden');
        };

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!modeSelectorBtn.contains(e.target) && !modePopup.contains(e.target)) {
                modePopup.classList.add('hidden');
            }
        });
    }

    // Mode Switching
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.onclick = () => {
            state.config.mode = btn.dataset.mode;
            updateUI();
        };
    });

    // Topic Selection
    document.getElementById('config-topic').onchange = (e) => {
        state.config.topic = e.target.value;
    };

    // Custom Prompt
    document.getElementById('config-custom-prompt').oninput = (e) => {
        state.config.customPrompt = e.target.value;
    };

    // Language
    document.getElementById('config-language').onchange = (e) => {
        state.config.language = e.target.value;
        updateUI();
    };

    // Generate Problem
    document.getElementById('btn-generate').onclick = async () => {
        state.isGenerating = true;
        UI.setGenerating(true);
        state.problem = null;
        state.analysis = null;
        state.userCode = '';
        state.chatMessages = []; // Reset chat
        document.getElementById('chat-messages').innerHTML = ''; // Clear chat UI
        document.getElementById('code-editor').value = '';
        UI.renderProblem(null);
        UI.renderFeedback(null);
        UI.toggleButtons(false);

        try {
            const data = await API.generateProblem(
                state.config.mode === 'custom' ? '' : state.config.topic,
                state.config.difficulty,
                state.config.mode === 'custom' ? state.config.customPrompt : undefined
            );

            state.problem = data;

            // Add to History
            const histItem = { id: Date.now().toString(), problem: data, timestamp: Date.now() };
            state.history.unshift(histItem);

            // Update UI
            updateUI(); // Refreshes history list and problem view

            // Auto-save to database if logged in
            if (state.currentUser) {
                try {
                    const saveResult = await API.saveHistory(
                        data,
                        '',
                        '',
                        state.config.language
                    );
                    if (saveResult.success) {
                        currentHistoryId = saveResult.id;
                    }
                } catch (err) {
                    console.error('Failed to save history:', err);
                }
            }

        } catch (err) {
            console.error(err);
            alert("Lỗi khi sinh đề. Vui lòng thử lại.");
        } finally {
            state.isGenerating = false;
            UI.setGenerating(false);
        }
    };

    // Editor Code
    document.getElementById('code-editor').oninput = (e) => {
        state.userCode = e.target.value;
        // Enable submit button if code exists
        const btn = document.getElementById('btn-submit');
        if (state.problem && state.userCode.trim()) {
            btn.disabled = false;
            btn.classList.remove('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            btn.classList.add('bg-text', 'text-black', 'hover:bg-white');
        } else {
            btn.disabled = true;
            btn.classList.add('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            btn.classList.remove('bg-text', 'text-black', 'hover:bg-white');
        }
    };

    // Submit / Analyze
    document.getElementById('btn-submit').onclick = async () => {
        if (!state.userCode.trim()) return;
        state.isAnalyzing = true;
        UI.setAnalyzing(true);

        try {
            const result = await API.analyzeSolution(state.problem, state.userCode, state.config.language);
            state.analysis = result;
            UI.renderFeedback(state.analysis);

            // Auto-update history in database if logged in
            if (state.currentUser && currentHistoryId) {
                try {
                    await API.updateHistory(
                        currentHistoryId,
                        state.userCode,
                        result.verdict || 'UNKNOWN'
                    );
                } catch (err) {
                    console.error('Failed to update history:', err);
                }
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi chấm bài.");
        } finally {
            state.isAnalyzing = false;
            UI.setAnalyzing(false);
        }
    };

    // Hint
    document.getElementById('btn-hint').onclick = async () => {
        state.isAnalyzing = true;
        UI.setAnalyzing(true);
        try {
            const result = await API.requestHint(state.problem, state.userCode, state.analysis ? state.analysis.feedbackMarkdown : '');
            if (state.analysis) {
                state.analysis.feedbackMarkdown += `\n\n---\n\n**GỢI Ý:**\n${result.hint}`;
            } else {
                state.analysis = { verdict: 'UNKNOWN', feedbackMarkdown: `**GỢI Ý:**\n${result.hint}` };
            }
            UI.renderFeedback(state.analysis);
        } catch (err) {
            console.error(err);
        } finally {
            state.isAnalyzing = false;
            UI.setAnalyzing(false);
        }
    };

    // Solution Modal
    document.getElementById('btn-solution').onclick = async () => {
        UI.toggleModal(true);
        if (!state.solutionData) {
            // Show loading inside modal
            document.getElementById('solution-content').innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-muted animate-pulse">
                    <div class="w-10 h-10 border-4 border-surfaceHighlight border-t-primary rounded-full animate-spin mb-4"></div>
                    <p>Đang phân tích thuật toán và viết code mẫu...</p>
                </div>
            `;
            try {
                const data = await API.generateSolution(state.problem, state.config.language);
                state.solutionData = data;
                UI.renderSolution(data);
            } catch (err) {
                console.error(err);
                alert("Không thể tạo lời giải lúc này.");
                UI.toggleModal(false);
            }
        } else {
            UI.renderSolution(state.solutionData);
        }
    };

    document.getElementById('btn-close-modal').onclick = () => {
        UI.toggleModal(false);
    };

    // Chat
    document.getElementById('chat-toggle').onclick = () => {
        UI.toggleChat(true);
    };
    document.getElementById('chat-close').onclick = () => {
        UI.toggleChat(false);
    };

    // Enable/disable chat send button based on input
    document.getElementById('chat-input').oninput = (e) => {
        const btn = document.getElementById('chat-send');
        const hasText = e.target.value.trim().length > 0;
        btn.disabled = !hasText;
        if (hasText) {
            btn.classList.remove('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            btn.classList.add('bg-primary', 'text-black', 'hover:bg-white');
        } else {
            btn.classList.add('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            btn.classList.remove('bg-primary', 'text-black', 'hover:bg-white');
        }
    };

    document.getElementById('chat-form').onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        // Reset send button to disabled state
        sendBtn.disabled = true;
        sendBtn.classList.add('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
        sendBtn.classList.remove('bg-primary', 'text-black', 'hover:bg-white');

        state.chatMessages.push({ role: 'user', text });
        UI.appendChatMessage('user', text);
        UI.setChatLoading(true);

        // Build context
        let context = "";
        if (state.problem) {
            context += `Tiêu đề bài toán: ${state.problem.title}\n`;
            context += `Mô tả: ${state.problem.description}\n`;
        }
        if (state.userCode) {
            context += `\nCode hiện tại của học sinh:\n${state.userCode}`;
        }

        try {
            const result = await API.sendChat(state.chatMessages, text, context);
            state.chatMessages.push({ role: 'model', text: result.text });
            UI.appendChatMessage('model', result.text);
        } catch (err) {
            UI.appendChatMessage('model', "Xin lỗi, đã xảy ra lỗi.");
        } finally {
            UI.setChatLoading(false);
        }
    };
}

function setDifficulty(diff) {
    state.config.difficulty = diff;
    updateUI();
}

function loadHistoryItem(item) {
    state.problem = item.problem;
    state.analysis = null;
    state.userCode = '';
    state.solutionData = null;
    document.getElementById('code-editor').value = '';
    UI.renderProblem(state.problem);
    UI.renderFeedback(null);
    UI.toggleButtons(true);
}

// Load history from database
async function loadHistoryFromDB() {
    if (!state.currentUser) {
        state.history = [];
        UI.renderHistory(state.history, loadHistoryItem);
        return;
    }

    try {
        const result = await API.loadHistory();
        if (result.success) {
            state.history = result.history.map(item => ({
                id: item.id.toString(),
                problem: item.problem,
                timestamp: new Date(item.timestamp).getTime(),
                userCode: item.userCode,
                verdict: item.verdict
            }));
            UI.renderHistory(state.history, loadHistoryItem);
        }
    } catch (err) {
        console.error('Failed to load history:', err);
    }
}

// Start
init();
