import React from 'react';
import { Difficulty, CoachState, HistoryItem } from '../types';
import { Terminal, BookOpen, Settings2, Sparkles, ListFilter, History, Clock, ChevronRight } from 'lucide-react';

interface ControlPanelProps {
  config: CoachState;
  setConfig: (config: CoachState) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  config, setConfig, onGenerate, isGenerating, history, onSelectHistory 
}) => {
  
  const topics = [
    "Mảng & Chuỗi", "Quy hoạch động", "Đồ thị (BFS/DFS/Dijkstra)", 
    "Tham lam (Greedy)", "Toán học & Số học", "Cấu trúc dữ liệu", "Đệ quy & Quay lui", "Tổ hợp"
  ];

  const handleModeSwitch = (mode: 'standard' | 'custom' | 'history') => {
      setConfig({...config, mode});
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', { 
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' 
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-1">
        {/* Mode Tabs */}
        <div className="flex bg-surface rounded p-1 border border-surfaceHighlight">
            <button 
                onClick={() => handleModeSwitch('standard')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs font-bold transition-all ${
                    config.mode === 'standard' 
                    ? 'bg-accent text-white shadow' 
                    : 'text-muted hover:text-text'
                }`}
                title="Tạo đề theo chủ đề"
            >
                <ListFilter className="w-3 h-3" /> <span className="hidden sm:inline">Chủ Đề</span>
            </button>
            <button 
                onClick={() => handleModeSwitch('custom')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs font-bold transition-all ${
                    config.mode === 'custom' 
                    ? 'bg-accent text-white shadow' 
                    : 'text-muted hover:text-text'
                }`}
                title="Tạo đề tùy chỉnh"
            >
                <Sparkles className="w-3 h-3" /> <span className="hidden sm:inline">Tự Chọn</span>
            </button>
            <button 
                onClick={() => handleModeSwitch('history')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs font-bold transition-all ${
                    config.mode === 'history' 
                    ? 'bg-accent text-white shadow' 
                    : 'text-muted hover:text-text'
                }`}
                title="Lịch sử đề bài"
            >
                <History className="w-3 h-3" /> <span className="hidden sm:inline">Lịch Sử</span>
            </button>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
            
            {/* Standard Mode Controls */}
            {config.mode === 'standard' && (
                <div className="animate-in fade-in duration-300 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2 flex items-center gap-2">
                            <BookOpen className="w-3 h-3" /> Chủ đề
                        </label>
                        <select 
                            value={config.topic}
                            onChange={(e) => setConfig({...config, topic: e.target.value})}
                            className="w-full bg-surface border border-surfaceHighlight rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-muted appearance-none"
                        >
                            <option value="" disabled>Chọn chủ đề</option>
                            {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2 flex items-center gap-2">
                            <Settings2 className="w-3 h-3" /> Độ khó mong muốn
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.values(Difficulty).map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setConfig({...config, difficulty: diff})}
                                    className={`text-left px-3 py-2 rounded text-xs transition-colors border ${
                                        config.difficulty === diff 
                                        ? 'bg-accent border-muted text-white' 
                                        : 'bg-surface border-surfaceHighlight text-muted hover:border-accent'
                                    }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Mode Controls */}
            {config.mode === 'custom' && (
                <div className="animate-in fade-in duration-300 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Yêu cầu đề bài
                        </label>
                        <textarea 
                            value={config.customPrompt}
                            onChange={(e) => setConfig({...config, customPrompt: e.target.value})}
                            className="w-full h-32 bg-surface border border-surfaceHighlight rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-muted resize-none placeholder-muted/50"
                            placeholder="VD: Hãy tạo một bài đồ thị về tìm đường đi ngắn nhất giữa các thành phố nhưng có thêm trọng số thời gian chờ..."
                        />
                         <p className="text-[10px] text-muted mt-2 leading-tight">
                            AI sẽ phân tích yêu cầu của bạn để tạo ra đề bài chuẩn format HSG.
                        </p>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2 flex items-center gap-2">
                            <Settings2 className="w-3 h-3" /> Độ khó (Ước lượng)
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.values(Difficulty).map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setConfig({...config, difficulty: diff})}
                                    className={`text-left px-3 py-2 rounded text-xs transition-colors border ${
                                        config.difficulty === diff 
                                        ? 'bg-accent border-muted text-white' 
                                        : 'bg-surface border-surfaceHighlight text-muted hover:border-accent'
                                    }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* History Mode View */}
            {config.mode === 'history' && (
                <div className="animate-in fade-in duration-300 space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-muted">
                            <History className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p className="text-xs">Chưa có lịch sử đề bài.</p>
                        </div>
                    ) : (
                        history.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onSelectHistory(item)}
                                className="w-full text-left bg-surface border border-surfaceHighlight rounded-lg p-3 hover:border-muted transition-all group flex flex-col gap-2"
                            >
                                <div className="flex justify-between items-start w-full">
                                    <h4 className="text-xs font-bold text-text line-clamp-2 group-hover:text-primary transition-colors">
                                        {item.problem.title}
                                    </h4>
                                    <ChevronRight className="w-3 h-3 text-muted shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-muted">
                                    <span className="bg-surfaceHighlight px-1.5 py-0.5 rounded text-white">{item.problem.difficulty}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {formatTime(item.timestamp)}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* Common Settings (Language) - Always visible except history maybe? Keeping it for consistency */}
            {config.mode !== 'history' && (
                 <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2 flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> Ngôn ngữ lập trình
                    </label>
                     <select 
                        value={config.language}
                        onChange={(e) => setConfig({...config, language: e.target.value})}
                        className="w-full bg-surface border border-surfaceHighlight rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-muted"
                    >
                        <option value="C++">C++ (Standard)</option>
                        <option value="Python">Python 3</option>
                        <option value="Java">Java</option>
                        <option value="Pascal">Pascal</option>
                    </select>
                </div>
            )}
        </div>

        {/* Generate Button - Hidden in History Mode */}
        {config.mode !== 'history' && (
            <button
                onClick={onGenerate}
                disabled={isGenerating || (config.mode === 'standard' && !config.topic) || (config.mode === 'custom' && !config.customPrompt.trim())}
                className={`mt-auto w-full py-3 rounded font-bold text-sm tracking-wide uppercase transition-all ${
                    isGenerating || (config.mode === 'standard' && !config.topic) || (config.mode === 'custom' && !config.customPrompt.trim())
                    ? 'bg-surfaceHighlight text-muted cursor-not-allowed'
                    : 'bg-primary text-black hover:bg-white'
                }`}
            >
                {isGenerating ? 'Đang tạo...' : 'Sinh đề bài mới'}
            </button>
        )}
    </div>
  );
};

export default ControlPanel;