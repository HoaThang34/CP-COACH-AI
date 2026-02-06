import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { AnalysisResult } from '../types';
import { Send, AlertTriangle, CheckCircle, XCircle, Star, Lightbulb, BookOpen } from 'lucide-react';

interface EditorPanelProps {
  code: string;
  setCode: (code: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onViewSolution: () => void;
  isAnalyzing: boolean;
  analysis: AnalysisResult | null;
  language: string;
  hasProblem: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ 
  code, setCode, onSubmit, onHint, onViewSolution, isAnalyzing, analysis, language, hasProblem 
}) => {

  // Logic to determine if the user passed or failed based on strict HSG standards
  const isCorrect = analysis?.verdict === 'CORRECT' || analysis?.verdict === 'EXCELLENT';
  const isIncorrect = analysis?.verdict === 'WRONG_DIRECTION' || analysis?.verdict === 'PARTIAL';

  const getVerdictHeader = (verdict: AnalysisResult['verdict']) => {
    switch (verdict) {
        case 'WRONG_DIRECTION': 
            return {
                bg: 'bg-red-500/10',
                border: 'border-red-500/30',
                text: 'text-red-400',
                icon: <XCircle className="w-5 h-5"/>,
                label: 'SAI HƯỚNG'
            };
        case 'PARTIAL': 
            return {
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-500/30',
                text: 'text-yellow-400',
                icon: <AlertTriangle className="w-5 h-5"/>,
                label: 'CHƯA CHÍNH XÁC / CÒN THIẾU SÓT'
            };
        case 'CORRECT': 
            return {
                bg: 'bg-green-500/10',
                border: 'border-green-500/30',
                text: 'text-green-400',
                icon: <CheckCircle className="w-5 h-5"/>,
                label: 'ĐÚNG - CHẤP NHẬN'
            };
        case 'EXCELLENT': 
            return {
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/30',
                text: 'text-purple-400',
                icon: <Star className="w-5 h-5"/>,
                label: 'XUẤT SẮC - TỐI ƯU'
            };
        default: 
            return {
                bg: 'bg-surface',
                border: 'border-surfaceHighlight',
                text: 'text-muted',
                icon: null,
                label: 'UNKNOWN'
            };
    }
  };

  const headerStyle = analysis ? getVerdictHeader(analysis.verdict) : null;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Code Area */}
      <div className="flex-1 flex flex-col bg-surface rounded-lg border border-surfaceHighlight overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-surfaceHighlight/50 border-b border-surfaceHighlight">
            <span className="text-xs font-mono text-muted">{language} Source File</span>
            <span className="text-xs text-muted">Paste your solution here</span>
        </div>
        <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-[#0d0d10] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
            placeholder="// Viết code giải của bạn ở đây..."
        />
      </div>

      {/* Action Bar */}
      <div className="flex gap-3">
        <button
            onClick={onSubmit}
            disabled={isAnalyzing || !hasProblem || !code.trim()}
            className={`flex-[2] flex items-center justify-center gap-2 py-3 rounded font-bold text-sm uppercase tracking-wide transition-all ${
                isAnalyzing || !hasProblem || !code.trim()
                ? 'bg-surfaceHighlight text-muted cursor-not-allowed'
                : 'bg-text text-black hover:bg-white shadow-lg shadow-white/5'
            }`}
        >
            {isAnalyzing ? (
                <>Analyzing...</>
            ) : (
                <><Send className="w-4 h-4" /> Nộp bài & Chấm</>
            )}
        </button>
        
        {analysis && (
           <button
            onClick={onHint}
            disabled={isAnalyzing}
            className="flex-1 px-4 rounded bg-surface border border-surfaceHighlight text-muted hover:text-text hover:border-muted transition-colors flex items-center justify-center gap-2"
            title="Xin gợi ý"
           >
            <Lightbulb className="w-4 h-4" /> <span className="hidden sm:inline text-xs font-bold">Gợi ý</span>
           </button>
        )}

        {hasProblem && (
           <button
            onClick={onViewSolution}
            disabled={isAnalyzing}
            className="flex-1 px-4 rounded bg-surface border border-surfaceHighlight text-muted hover:text-text hover:border-accent transition-colors flex items-center justify-center gap-2"
            title="Xem lời giải & Code mẫu"
           >
            <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline text-xs font-bold">Lời giải mẫu</span>
           </button>
        )}
      </div>

      {/* Feedback Area */}
      {analysis && headerStyle && (
        <div className={`rounded-lg border overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-xl flex flex-col max-h-[400px] ${headerStyle.border}`}>
            {/* Verdict Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${headerStyle.bg} ${headerStyle.border}`}>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${headerStyle.text}`}>
                        {headerStyle.icon}
                        {headerStyle.label}
                    </span>
                </div>
                <span className="text-xs text-muted/60 font-mono">AI Judge Verdict</span>
            </div>
            
            {/* Markdown Content - Styled exactly like SolutionModal */}
            <div className="p-5 overflow-y-auto custom-scrollbar bg-[#121214]">
                <div className="prose prose-invert max-w-none text-sm text-gray-300 
                            prose-headings:text-text prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest 
                            prose-headings:mt-6 prose-headings:mb-3 prose-headings:border-b prose-headings:border-surfaceHighlight/50 prose-headings:pb-2
                            first:prose-headings:mt-0
                            prose-strong:text-white prose-strong:font-bold
                            prose-code:text-primary prose-code:bg-surfaceHighlight prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                            prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
                            prose-li:my-1 prose-li:text-gray-300
                            prose-p:leading-relaxed
                        ">
                    <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {analysis.feedbackMarkdown}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EditorPanel;
