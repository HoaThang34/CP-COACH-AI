// Chat Page Logic
// Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

import { API } from './api.js';
import { renderMarkdown } from './markdown_renderer.js';

// State
const chatMessages = [];

// Initialize
function init() {
    // Use global lucide from CDN
    if (window.lucide) {
        window.lucide.createIcons();
    }
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    if (!form || !input || !sendBtn) {
        console.error('Chat elements not found');
        return;
    }

    // Enable/disable send button based on input
    input.addEventListener('input', () => {
        const hasText = input.value.trim().length > 0;
        sendBtn.disabled = !hasText;
        if (hasText) {
            sendBtn.classList.remove('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            sendBtn.classList.add('bg-gradient-to-r', 'from-neon', 'to-purple-600', 'text-white');
        } else {
            sendBtn.classList.add('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            sendBtn.classList.remove('bg-gradient-to-r', 'from-neon', 'to-purple-600', 'text-white');
        }
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        sendBtn.disabled = true;
        sendBtn.classList.add('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
        sendBtn.classList.remove('bg-gradient-to-r', 'from-neon', 'to-purple-600', 'text-white');

        await sendMessage(text);
    });

    // Quick prompts
    document.querySelectorAll('.quick-prompt').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent.trim();
            input.value = text;
            input.dispatchEvent(new Event('input'));
            input.focus();
        });
    });
}

// Send Message
async function sendMessage(text) {
    // Clear welcome message on first message
    if (chatMessages.length === 0) {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = '<div class="chat-container p-6 space-y-6" id="messages-list"></div>';
    }

    // Add user message
    chatMessages.push({ role: 'user', text });
    appendMessage('user', text);

    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
        const result = await API.sendChat(chatMessages, text, '');
        removeTypingIndicator(typingId);

        chatMessages.push({ role: 'model', text: result.text });
        appendMessage('model', result.text);
    } catch (err) {
        removeTypingIndicator(typingId);
        appendMessage('model', 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.');
        console.error('Chat error:', err);
    }
}

// Append Message to UI
function appendMessage(role, text) {
    const container = document.getElementById('messages-list') || document.querySelector('.chat-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `flex gap-4 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`;

    let contentHtml = text;
    if (role !== 'user') {
        contentHtml = `<div class="prose prose-invert max-w-none prose-sm prose-p:my-2 prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/5 prose-pre:p-4 prose-pre:rounded-xl prose-code:text-neon prose-code:bg-white/5 prose-code:px-1.5 prose-code:rounded">${renderMarkdown(text)}</div>`;
    }

    // Use inline SVG icons instead of lucide data attributes
    const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

    div.innerHTML = `
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${role === 'user'
            ? 'bg-neon/20 text-neon'
            : 'bg-gradient-to-br from-neon to-purple-600 text-white'}">
            ${role === 'user' ? userIcon : botIcon}
        </div>
        <div class="max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${role === 'user'
            ? 'message-user'
            : 'message-ai'}">
            ${contentHtml}
        </div>
    `;

    container.appendChild(div);

    // Scroll to bottom
    const messagesArea = document.getElementById('chat-messages');
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

// Typing Indicator
function showTypingIndicator() {
    const container = document.getElementById('messages-list') || document.querySelector('.chat-container');
    if (!container) return null;

    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex gap-4';

    const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

    div.innerHTML = `
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 bg-gradient-to-br from-neon to-purple-600 text-white">
            ${botIcon}
        </div>
        <div class="message-ai rounded-2xl px-5 py-4">
            <div class="flex gap-1">
                <span class="w-2 h-2 bg-muted rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-muted rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-muted rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
        </div>
    `;
    container.appendChild(div);

    const messagesArea = document.getElementById('chat-messages');
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    return id;
}

function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Wait for DOM and start
document.addEventListener('DOMContentLoaded', init);
