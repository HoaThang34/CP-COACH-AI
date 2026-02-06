// Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

export const Difficulty = {
    EASY: "Cơ bản",
    MEDIUM: "Kết hợp thuật toán cơ bản",
    HARD: "Kết hợp thuật toán nâng cao",
    EXPERT: "Mức độ HSG Cấp Tỉnh",
    HSG_QG: "Mức độ HSG Quốc Gia"
};

export const state = {
    config: {
        mode: 'standard', // standard | custom | history
        topic: '',
        difficulty: Difficulty.EASY,
        language: 'C++',
        customPrompt: ''
    },
    problem: null,
    userCode: '',
    analysis: null,
    history: [], // Array of { id, problem, timestamp }

    // Authentication
    currentUser: null, // { user_id, username } or null

    // Chat
    chatMessages: [],
    isChatOpen: false,

    // UI State
    isGenerating: false,
    isAnalyzing: false,
    isLoadingChat: false,
    isLoadingSolution: false
};

// Simple event bus or listener could go here, but we'll manage updates in app.js/ui.js
