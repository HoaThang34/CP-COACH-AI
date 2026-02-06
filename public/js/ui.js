
import { renderMarkdown } from './markdown_renderer.js';
import { Difficulty } from './state.js';
import * as lucid from 'https://unpkg.com/lucide@latest';

export const UI = {
    initIcons() {
        lucide.createIcons();
    },

    setMode(mode) {
        // Tabs
        document.querySelectorAll('.mode-btn').forEach(btn => {
            const btnMode = btn.dataset.mode;
            if (btnMode === mode) {
                btn.classList.add('bg-accent', 'text-white', 'shadow');
                btn.classList.remove('text-muted', 'hover:text-text');
            } else {
                btn.classList.remove('bg-accent', 'text-white', 'shadow');
                btn.classList.add('text-muted', 'hover:text-text');
            }
        });

        // Content
        ['standard', 'custom', 'history'].forEach(m => {
            const el = document.getElementById(`config-${m}`);
            if (m === mode) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });

        // Common Language Config
        const langContainer = document.getElementById('config-language-container');
        if (mode === 'history') langContainer.classList.add('hidden');
        else langContainer.classList.remove('hidden');

        // Generate Button
        const genBtn = document.getElementById('btn-generate');
        if (mode === 'history') genBtn.classList.add('hidden');
        else genBtn.classList.remove('hidden');
    },

    renderDifficultyOptions(selectedDiff, containerId, onSelect) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        Object.keys(Difficulty).forEach(key => {
            const diff = Difficulty[key];
            const btn = document.createElement('button');
            const isSelected = diff === selectedDiff;
            btn.className = `text-left px-3 py-2 rounded text-xs transition-colors border ${isSelected
                    ? 'bg-accent border-muted text-white'
                    : 'bg-surface border-surfaceHighlight text-muted hover:border-accent'
                }`;
            btn.textContent = diff;
            btn.onclick = () => onSelect(diff);
            container.appendChild(btn);
        });
    },

    setGenerating(isGenerating) {
        const btn = document.getElementById('btn-generate');
        btn.disabled = isGenerating;
        btn.textContent = isGenerating ? 'Đang tạo...' : 'Sinh đề bài mới';

        // Show loading state in problem panel if generating
        if (isGenerating) {
            document.getElementById('problem-loading').classList.remove('hidden');
            document.getElementById('problem-content-container').classList.add('hidden');
            document.getElementById('problem-empty').classList.add('hidden');
        }
    },

    renderProblem(problem) {
        document.getElementById('problem-loading').classList.add('hidden');

        if (!problem) {
            document.getElementById('problem-empty').classList.remove('hidden');
            document.getElementById('problem-content-container').classList.add('hidden');
            return;
        }

        document.getElementById('problem-empty').classList.add('hidden');
        document.getElementById('problem-content-container').classList.remove('hidden');

        // Toolbar
        document.getElementById('prob-title').textContent = problem.title;
        document.getElementById('prob-difficulty').textContent = problem.difficulty;
        document.getElementById('prob-topic').textContent = problem.topic;

        // Print header
        document.getElementById('print-title').textContent = problem.title;
        document.getElementById('print-diff').textContent = problem.difficulty;
        document.getElementById('print-topic').textContent = problem.topic;

        // Content
        let html = '';

        // Description
        html += `<div class="prose prose-invert max-w-none print:prose-black prose-code:text-primary prose-code:bg-surfaceHighlight prose-code:px-1 prose-code:rounded prose-strong:text-white">
            ${renderMarkdown(problem.description)}
        </div>`;

        // IO Format
        html += `<section class="grid grid-cols-1 gap-4 bg-surfaceHighlight/30 p-4 rounded-lg border border-surfaceHighlight print:bg-transparent print:border-gray-300 print:p-0 print:gap-6 mt-6">
            <div>
                <h3 class="flex items-center gap-2 font-bold text-text mb-2 print:text-black">Input Format</h3>
                <div class="print:text-sm prose prose-invert max-w-none prose-p:my-0 prose-sm">${renderMarkdown(problem.inputFormat)}</div>
            </div>
            <div>
                <h3 class="flex items-center gap-2 font-bold text-text mb-2 print:text-black">Output Format</h3>
                <div class="print:text-sm prose prose-invert max-w-none prose-p:my-0 prose-sm">${renderMarkdown(problem.outputFormat)}</div>
            </div>
        </section>`;

        // Constraints
        html += `<section class="mt-6">
            <h3 class="font-bold text-text mb-2 print:text-black">Constraints</h3>
            <div class="font-mono text-xs bg-surface p-3 rounded border border-surfaceHighlight text-yellow-500/90 print:bg-gray-50 print:text-black print:border-gray-300">
                ${renderMarkdown(problem.constraints)}
            </div>
        </section>`;

        // Examples
        html += `<section class="mt-6"><h3 class="font-bold text-text mb-3 print:text-black">Examples</h3><div class="space-y-4">`;
        problem.examples.forEach(ex => {
            html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-surfaceHighlight rounded overflow-hidden example-box print:border-gray-400">
                <div class="bg-surface p-3 border-b md:border-b-0 md:border-r border-surfaceHighlight print:bg-transparent print:border-gray-400">
                    <span class="text-xs text-muted uppercase font-bold block mb-1 print:text-gray-600">Input</span>
                    <pre class="font-mono text-xs whitespace-pre-wrap print:text-black">${ex.input}</pre>
                </div>
                <div class="bg-surface p-3 print:bg-transparent">
                    <span class="text-xs text-muted uppercase font-bold block mb-1 print:text-gray-600">Output</span>
                    <pre class="font-mono text-xs whitespace-pre-wrap print:text-black">${ex.output}</pre>
                </div>
            </div>`;
        });
        html += `</div></section>`;

        document.getElementById('prob-markdown').innerHTML = html;
        this.initIcons(); // Re-init icons if any injected
    },

    renderHistory(history, onSelect) {
        const list = document.getElementById('history-list');
        list.innerHTML = '';
        if (history.length === 0) {
            list.innerHTML = `<div class="text-center py-10 text-muted"><i data-lucide="history" class="w-10 h-10 mx-auto mb-2 opacity-20"></i><p class="text-xs">Chưa có lịch sử đề bài.</p></div>`;
            this.initIcons();
            return;
        }

        history.forEach(item => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left bg-surface border border-surfaceHighlight rounded-lg p-3 hover:border-muted transition-all group flex flex-col gap-2 mb-2";
            btn.innerHTML = `
                <div class="flex justify-between items-start w-full">
                    <h4 class="text-xs font-bold text-text line-clamp-2 group-hover:text-primary transition-colors">${item.problem.title}</h4>
                </div>
                <div class="flex items-center gap-2 text-[10px] text-muted">
                    <span class="bg-surfaceHighlight px-1.5 py-0.5 rounded text-white">${item.problem.difficulty}</span>
                    <span class="flex items-center gap-1">${new Date(item.timestamp).toLocaleDateString('vi-VN')}</span>
                </div>
            `;
            btn.onclick = () => onSelect(item);
            list.appendChild(btn);
        });
    },

    setEditorLang(lang) {
        document.getElementById('editor-lang-label').textContent = `${lang} Source File`;
    },

    setAnalyzing(isAnalyzing) {
        const btn = document.getElementById('btn-submit');
        const hintBtn = document.getElementById('btn-hint');
        const solBtn = document.getElementById('btn-solution');

        btn.disabled = isAnalyzing;
        btn.innerHTML = isAnalyzing ? `Analyzing...` : `<i data-lucide="send" class="w-4 h-4"></i> <span>Nộp bài & Chấm</span>`;
        if (hintBtn) hintBtn.disabled = isAnalyzing;
        if (solBtn) solBtn.disabled = isAnalyzing;

        this.initIcons();
    },

    renderFeedback(analysis) {
        const area = document.getElementById('feedback-area');
        const content = document.getElementById('feedback-content');
        const header = document.getElementById('feedback-header');
        const label = document.getElementById('feedback-label');

        if (!analysis) {
            area.classList.add('hidden');
            return;
        }
        area.classList.remove('hidden');
        content.innerHTML = renderMarkdown(analysis.feedbackMarkdown);

        // Header Styling
        let styles = { bg: 'bg-surface', border: 'border-surfaceHighlight', text: 'text-muted', icon: '', label: 'UNKNOWN' };

        switch (analysis.verdict) {
            case 'WRONG_DIRECTION':
                styles = { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: 'x-circle', label: 'SAI HƯỚNG' }; break;
            case 'PARTIAL':
                styles = { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: 'alert-triangle', label: 'CHƯA CHÍNH XÁC / CÒN THIẾU SÓT' }; break;
            case 'CORRECT':
                styles = { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: 'check-circle', label: 'ĐÚNG - CHẤP NHẬN' }; break;
            case 'EXCELLENT':
                styles = { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'star', label: 'XUẤT SẮC - TỐI ƯU' }; break;
        }

        area.className = `rounded-lg border overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-xl flex flex-col max-h-[400px] ${styles.border}`;
        header.className = `px-4 py-3 border-b flex items-center justify-between shrink-0 ${styles.bg} ${styles.border}`;
        label.className = `text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${styles.text}`;
        label.innerHTML = `<i data-lucide="${styles.icon}" class="w-5 h-5"></i> ${styles.label}`;

        // Buttons
        document.getElementById('btn-hint').classList.remove('hidden');

        this.initIcons();
        // Scroll feedback into view?
    },

    toggleButtons(hasProblem) {
        const submitBtn = document.getElementById('btn-submit');
        const solBtn = document.getElementById('btn-solution');

        if (hasProblem) {
            submitBtn.classList.remove('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            submitBtn.classList.add('bg-text', 'text-black', 'hover:bg-white', 'shadow-lg', 'shadow-white/5');
            submitBtn.disabled = false;
            solBtn.classList.remove('hidden');
            solBtn.disabled = false;
        } else {
            submitBtn.classList.add('bg-surfaceHighlight', 'text-muted', 'cursor-not-allowed');
            submitBtn.classList.remove('bg-text', 'text-black', 'hover:bg-white');
            submitBtn.disabled = true;
            solBtn.classList.add('hidden');
        }
    },

    renderSolution(data) {
        if (!data) return;
        const container = document.getElementById('solution-content');
        container.innerHTML = `
            <div class="space-y-8">
                <div class="bg-surfaceHighlight/30 p-4 rounded border border-surfaceHighlight">
                    <h3 class="text-xs font-bold text-muted uppercase mb-1">Độ phức tạp</h3>
                    <div class="font-mono text-sm text-yellow-500/90 prose prose-invert max-w-none prose-p:my-0 prose-strong:text-yellow-400">
                        ${renderMarkdown(data.complexity)}
                    </div>
                </div>
                <section>
                    <h3 class="text-lg font-bold text-text mb-3 border-b border-surfaceHighlight pb-2 flex items-center gap-2">1. Phân tích thuật toán</h3>
                    <div class="prose prose-invert max-w-none text-sm text-gray-300 print:prose-black prose-strong:text-white prose-strong:font-bold prose-code:text-primary prose-code:bg-surfaceHighlight prose-code:px-1 prose-code:rounded">
                        ${renderMarkdown(data.explanation)}
                    </div>
                </section>
                <section>
                    <h3 class="text-lg font-bold text-text mb-3 border-b border-surfaceHighlight pb-2 flex items-center gap-2">2. Code mẫu</h3>
                     <div class="relative group">
                        <pre class="bg-[#0d0d10] p-4 rounded border border-surfaceHighlight font-mono text-xs overflow-x-auto text-gray-300 print:bg-white print:border-gray-300 print:text-black whitespace-pre-wrap">${data.sampleCode}</pre>
                    </div>
                </section>
            </div>
        `;
    },

    toggleModal(isOpen) {
        const modal = document.getElementById('solution-modal');
        if (isOpen) {
            modal.classList.remove('hidden');
            document.body.classList.add('has-modal-open');
        } else {
            modal.classList.add('hidden');
            document.body.classList.remove('has-modal-open');
        }
    },

    toggleChat(isOpen) {
        const chatWindow = document.getElementById('chat-window');
        const chatToggle = document.getElementById('chat-toggle');
        if (isOpen) {
            chatWindow.classList.remove('hidden');
            chatToggle.classList.add('hidden');
        } else {
            chatWindow.classList.add('hidden');
            chatToggle.classList.remove('hidden');
        }
    },

    appendChatMessage(role, text) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `flex items-start gap-2 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`;

        let contentHtml = text;
        if (role !== 'user') contentHtml = `<div class="prose prose-invert max-w-none prose-sm prose-p:my-1 prose-pre:bg-[#09090b] prose-pre:border prose-pre:border-surfaceHighlight prose-pre:p-2 prose-code:text-primary prose-code:bg-surfaceHighlight prose-code:px-1 prose-code:rounded">${renderMarkdown(text)}</div>`;

        div.innerHTML = `
            <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${role === 'user' ? 'bg-accent text-white' : 'bg-primary text-black'}">
                <i data-lucide="${role === 'user' ? 'user' : 'bot'}" class="w-3 h-3"></i>
            </div>
            <div class="max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${role === 'user' ? 'bg-accent text-white' : 'bg-surfaceHighlight/50 text-gray-200 border border-surfaceHighlight'}">
                ${contentHtml}
            </div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        this.initIcons();
    },

    setChatLoading(isLoading) {
        const btn = document.getElementById('chat-send');
        btn.disabled = isLoading;
        // Optionally show loader bubble
    }
};
