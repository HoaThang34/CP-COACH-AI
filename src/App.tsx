import React, { useState } from 'react';
import { Problem, Difficulty, CoachState, AnalysisResult, SolutionData, ChatMessage, HistoryItem } from './types';
import ControlPanel from './components/ControlPanel';
import ProblemPanel from './components/ProblemPanel';
import EditorPanel from './components/EditorPanel';
import SolutionModal from './components/SolutionModal';
import ChatWidget from './components/ChatWidget';
import { generateProblem, analyzeSolution, requestHint, generateSolution, sendChatToTutor } from './services/geminiService';
import { Code2, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<CoachState>({
    mode: 'standard',
    topic: 'Mảng & Chuỗi',
    difficulty: Difficulty.EASY,
    language: 'C++',
    customPrompt: ''
  });

  const [problem, setProblem] = useState<Problem | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Solution Modal State
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);
  const [isFetchingSolution, setIsFetchingSolution] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleGenerateProblem = async () => {
    setIsGenerating(true);
    setAnalysis(null);
    setSolutionData(null); // Reset previous solution
    setUserCode('');
    // Optionally reset chat when new problem starts, or keep it. Let's keep it but add a separator if we were to be fancy.
    // For now, let's clear chat on new problem to keep context fresh
    setChatMessages([]); 
    
    try {
      // Pass custom prompt if in custom mode
      const customRequest = config.mode === 'custom' ? config.customPrompt : undefined;
      const newProblem = await generateProblem(config.topic, config.difficulty, customRequest);
      setProblem(newProblem);

      // Save to History
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        problem: newProblem,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (error) {
      alert("Lỗi khi sinh đề. Vui lòng thử lại (Kiểm tra API Key).");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setProblem(item.problem);
    setAnalysis(null);
    setSolutionData(null);
    setUserCode(''); // Or store userCode in history if we want to restore it later
    setChatMessages([]);
    // Note: We stay in 'history' mode on the panel, but the problem view updates
  };

  const handleSubmitSolution = async () => {
    if (!problem || !userCode.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeSolution(problem, userCode, config.language);
      setAnalysis(result);
    } catch (error) {
      alert("Lỗi khi chấm bài.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHint = async () => {
    if(!problem || !userCode || !analysis) return;
    setIsAnalyzing(true); // Re-use loading state
    try {
        const hint = await requestHint(problem, userCode, analysis.feedbackMarkdown);
        setAnalysis(prev => prev ? {
            ...prev,
            feedbackMarkdown: prev.feedbackMarkdown + `\n\n---\n\n**GỢI Ý:**\n${hint}`
        } : null);
    } catch (error) {
        console.error(error);
    } finally {
        setIsAnalyzing(false);
    }
  }

  const handleViewSolution = async () => {
    if (!problem) return;
    setIsSolutionModalOpen(true);

    if (!solutionData) {
        setIsFetchingSolution(true);
        try {
            const data = await generateSolution(problem, config.language);
            setSolutionData(data);
        } catch (error) {
            console.error(error);
            alert("Không thể tạo lời giải lúc này.");
            setIsSolutionModalOpen(false);
        } finally {
            setIsFetchingSolution(false);
        }
    }
  };

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    try {
        // Build context for the bot
        let context = "";
        if (problem) {
            context += `Tiêu đề bài toán: ${problem.title}\n`;
            context += `Mô tả: ${problem.description}\n`;
        }
        if (userCode) {
            context += `\nCode hiện tại của học sinh:\n${userCode}`;
        }

        const responseText = await sendChatToTutor(chatMessages, text, context);
        
        const newBotMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
        setChatMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
        console.error(error);
        const errorMsg: ChatMessage = { role: 'model', text: "Đã xảy ra lỗi khi kết nối với AI.", timestamp: Date.now() };
        setChatMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background text-text overflow-hidden font-sans">
      {/* Header - Hidden on Print */}
      <header className="h-14 border-b border-surfaceHighlight flex items-center px-6 bg-surface/50 backdrop-blur-sm z-10 shrink-0 print-hidden">
        <div className="flex items-center gap-3 text-primary">
          <div className="bg-primary text-black p-1.5 rounded">
             <Cpu size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-lg">CP Coach AI</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs text-muted">
            <span className="hidden md:inline">Luyện thi HSG Tin học</span>
            <div className="h-4 w-[1px] bg-surfaceHighlight"></div>
            <span>Powered by Gemini 2.0</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Config - Hidden on Print */}
        <aside className="w-64 bg-background border-r border-surfaceHighlight p-4 hidden md:flex flex-col shrink-0 print-hidden">
           <ControlPanel 
             config={config} 
             setConfig={setConfig} 
             onGenerate={handleGenerateProblem}
             isGenerating={isGenerating}
             history={history}
             onSelectHistory={handleSelectHistory}
           />
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
          
          {/* Mobile Config Toggle could go here, omitting for simplicity/cleanliness */}

          {/* Left: Problem Display - Expands on Print */}
          <section className="flex-1 h-1/2 md:h-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-surfaceHighlight overflow-hidden relative problem-section">
             <ProblemPanel problem={problem} isLoading={isGenerating} />
          </section>

          {/* Right: Code Editor & Feedback - Hidden on Print */}
          <section className="flex-1 h-1/2 md:h-full md:w-1/2 p-6 bg-[#0c0c0e] editor-section print-hidden">
             <EditorPanel 
               code={userCode} 
               setCode={setUserCode} 
               onSubmit={handleSubmitSolution}
               onHint={handleHint}
               onViewSolution={handleViewSolution}
               isAnalyzing={isAnalyzing}
               analysis={analysis}
               language={config.language}
               hasProblem={!!problem}
             />
          </section>

        </div>
      </main>

      {/* Solution Modal */}
      <SolutionModal 
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        data={solutionData}
        isLoading={isFetchingSolution}
        language={config.language}
      />

      {/* Chat Bot Widget */}
      <ChatWidget 
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
    </div>
  );
};

export default App;