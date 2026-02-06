import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { SolutionData } from '../types';
import { X, Printer, BookOpen, Code2, Download } from 'lucide-react';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SolutionData | null;
  isLoading: boolean;
  language: string;
}

const SolutionModal: React.FC<SolutionModalProps> = ({ isOpen, onClose, data, isLoading, language }) => {
  
  // Handle Print Body Class
  useEffect(() => {
    if (isOpen) {
        document.body.classList.add('has-modal-open');
    } else {
        document.body.classList.remove('has-modal-open');
    }
    return () => document.body.classList.remove('has-modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 solution-modal-overlay">
      <div className="bg-surface border border-surfaceHighlight rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl solution-modal-content">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surfaceHighlight bg-surfaceHighlight/20">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Lời giải & Code mẫu
            </h2>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handlePrint}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface border border-surfaceHighlight text-xs font-bold text-muted hover:text-text hover:border-accent transition-all print-hidden"
                >
                    <Printer className="w-4 h-4" />
                    <span>Tải PDF / In</span>
                </button>
                <button 
                    onClick={onClose}
                    className="p-1.5 rounded hover:bg-surfaceHighlight text-muted hover:text-text transition-colors print-hidden"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar solution-content">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted animate-pulse">
                    <div className="w-10 h-10 border-4 border-surfaceHighlight border-t-primary rounded-full animate-spin mb-4"></div>
                    <p>Đang phân tích thuật toán và viết code mẫu...</p>
                </div>
            ) : data ? (
                <div className="space-y-8">
                    {/* Complexity */}
                    <div className="bg-surfaceHighlight/30 p-4 rounded border border-surfaceHighlight">
                        <h3 className="text-xs font-bold text-muted uppercase mb-1">Độ phức tạp</h3>
                        <div className="font-mono text-sm text-yellow-500/90 prose prose-invert max-w-none prose-p:my-0 prose-strong:text-yellow-400">
                            <ReactMarkdown 
                                remarkPlugins={[remarkMath, remarkGfm]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {data.complexity}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Explanation */}
                    <section>
                        <h3 className="text-lg font-bold text-text mb-3 border-b border-surfaceHighlight pb-2 flex items-center gap-2">
                           1. Phân tích thuật toán
                        </h3>
                        <div className="prose prose-invert max-w-none text-sm text-gray-300 print:prose-black 
                            prose-strong:text-white prose-strong:font-bold
                            prose-code:text-primary prose-code:bg-surfaceHighlight prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                        ">
                            <ReactMarkdown 
                                remarkPlugins={[remarkMath, remarkGfm]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {data.explanation}
                            </ReactMarkdown>
                        </div>
                    </section>

                    {/* Code */}
                    <section>
                        <h3 className="text-lg font-bold text-text mb-3 border-b border-surfaceHighlight pb-2 flex items-center gap-2">
                           2. Code mẫu ({language})
                        </h3>
                        <div className="relative group">
                            <pre className="bg-[#0d0d10] p-4 rounded border border-surfaceHighlight font-mono text-xs overflow-x-auto text-gray-300 print:bg-white print:border-gray-300 print:text-black whitespace-pre-wrap">
                                {data.sampleCode}
                            </pre>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="text-center text-muted py-10">Không có dữ liệu lời giải.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SolutionModal;
