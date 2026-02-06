
export const Difficulty = {
    EASY: "Dễ",
    MEDIUM: "Trung bình",
    HARD: "Khó",
    EXPERT: "Chuyên gia",
    HSG_QG: "HSG Quốc gia"
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
