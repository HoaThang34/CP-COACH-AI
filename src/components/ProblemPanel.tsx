import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Problem } from '../types';
import { FileText, Database, Box, Download, Printer } from 'lucide-react';

interface ProblemPanelProps {
  problem: Problem | null;
  isLoading: boolean;
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem, isLoading }) => {
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted animate-pulse">
        <div className="w-12 h-12 border-4 border-surfaceHighlight border-t-text rounded-full animate-spin mb-4"></div>
        <p>Đang sinh đề bài chuẩn HSG...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted p-8 text-center">
        <Database className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-xl font-medium text-text mb-2">Chưa có đề bài</h3>
        <p className="text-sm">Vui lòng chọn chủ đề hoặc nhập yêu cầu để bắt đầu luyện tập.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       {/* Toolbar - Hidden when printing */}
      <div className="flex justify-between items-start mb-6 border-b border-surfaceHighlight pb-4 print-hidden shrink-0">
         <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent text-text uppercase tracking-wider">{problem.difficulty}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-surfaceHighlight text-muted uppercase tracking-wider">{problem.topic}</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">{problem.title}</h1>
         </div>
         <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface border border-surfaceHighlight text-xs font-bold text-muted hover:text-text hover:border-accent transition-all"
            title="In đề bài hoặc Lưu dưới dạng PDF"
         >
            <Printer className="w-4 h-4" /> 
            <span className="hidden sm:inline">Tải PDF / In</span>
         </button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-6 border-b border-gray-300 pb-4">
         <h1 className="text-3xl font-bold text-black mb-2">{problem.title}</h1>
         <div className="flex gap-4 text-sm text-gray-600 font-bold uppercase">
             <span>{problem.difficulty}</span>
             <span>|</span>
             <span>{problem.topic}</span>
         </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar problem-content">
        <div className="space-y-6 text-sm leading-relaxed text-gray-300 print:text-black">
            <section>
            <div className="prose prose-invert max-w-none print:prose-black 
                prose-code:text-primary prose-code:bg-surfaceHighlight prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-strong:text-white
            ">
                <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {problem.description}
                </ReactMarkdown>
            </div>
            </section>

            <section className="grid grid-cols-1 gap-4 bg-surfaceHighlight/30 p-4 rounded-lg border border-surfaceHighlight print:bg-transparent print:border-gray-300 print:p-0 print:gap-6">
            <div>
                <h3 className="flex items-center gap-2 font-bold text-text mb-2 print:text-black">
                <Box className="w-4 h-4 print:hidden" /> Input Format
                </h3>
                <div className="print:text-sm prose prose-invert max-w-none prose-p:my-0 prose-sm">
                    <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {problem.inputFormat}
                    </ReactMarkdown>
                </div>
            </div>
            <div>
                <h3 className="flex items-center gap-2 font-bold text-text mb-2 print:text-black">
                <Box className="w-4 h-4 print:hidden" /> Output Format
                </h3>
                <div className="print:text-sm prose prose-invert max-w-none prose-p:my-0 prose-sm">
                    <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {problem.outputFormat}
                    </ReactMarkdown>
                </div>
            </div>
            </section>

            <section>
            <h3 className="font-bold text-text mb-2 print:text-black">Constraints</h3>
            <div className="font-mono text-xs bg-surface p-3 rounded border border-surfaceHighlight text-yellow-500/90 print:bg-gray-50 print:text-black print:border-gray-300">
                <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {problem.constraints}
                </ReactMarkdown>
            </div>
            </section>

            <section>
            <h3 className="font-bold text-text mb-3 print:text-black">Examples</h3>
            <div className="space-y-4">
                {problem.examples.map((ex, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-surfaceHighlight rounded overflow-hidden example-box print:border-gray-400">
                    <div className="bg-surface p-3 border-b md:border-b-0 md:border-r border-surfaceHighlight print:bg-transparent print:border-gray-400">
                    <span className="text-xs text-muted uppercase font-bold block mb-1 print:text-gray-600">Input</span>
                    <pre className="font-mono text-xs whitespace-pre-wrap print:text-black">{ex.input}</pre>
                    </div>
                    <div className="bg-surface p-3 print:bg-transparent">
                    <span className="text-xs text-muted uppercase font-bold block mb-1 print:text-gray-600">Output</span>
                    <pre className="font-mono text-xs whitespace-pre-wrap print:text-black">{ex.output}</pre>
                    </div>
                </div>
                ))}
            </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;
