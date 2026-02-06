import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { MessageCircle, X, Send, Minus, Loader2, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  isOpen, onToggle, messages, onSendMessage, isLoading 
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-lg shadow-primary/20 hover:scale-110 transition-transform z-50 flex items-center justify-center print:hidden group"
        title="Chat với trợ lý học tập"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-3 bg-surface border border-surfaceHighlight px-2 py-1 rounded text-xs text-text opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Hỏi trợ lý AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-100px)] bg-surface border border-surfaceHighlight rounded-xl shadow-2xl flex flex-col z-50 print:hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surfaceHighlight bg-surfaceHighlight/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
             <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-text">Trợ lý Học tập</h3>
            <p className="text-[10px] text-muted">Hỏi đáp về thuật toán & Code</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className="p-1.5 rounded hover:bg-surfaceHighlight text-muted hover:text-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 bg-[#0c0c0e]">
        {messages.length === 0 && (
           <div className="text-center text-muted text-sm mt-10 px-6">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Xin chào! Tôi có thể giúp gì cho bạn về bài tập này hoặc các kiến thức lập trình?</p>
           </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-accent text-white' : 'bg-primary text-black'
            }`}>
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
            </div>
            
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-accent text-white' 
                : 'bg-surfaceHighlight/50 text-gray-200 border border-surfaceHighlight'
            }`}>
               {msg.role === 'user' ? (
                   msg.text
               ) : (
                <div className="prose prose-invert max-w-none prose-sm 
                    prose-p:my-1 
                    prose-pre:bg-[#09090b] prose-pre:border prose-pre:border-surfaceHighlight prose-pre:p-2
                    prose-code:text-primary prose-code:bg-surfaceHighlight prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {msg.text}
                    </ReactMarkdown>
                </div>
               )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3" />
                </div>
                <div className="bg-surfaceHighlight/50 rounded-lg px-3 py-2 border border-surfaceHighlight flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-muted" />
                    <span className="text-xs text-muted">Đang trả lời...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-surfaceHighlight bg-surface">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 bg-surfaceHighlight/50 border border-surfaceHighlight rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-muted placeholder-muted/50"
            />
            <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-md transition-colors flex items-center justify-center ${
                    isLoading || !input.trim() 
                    ? 'bg-surfaceHighlight text-muted cursor-not-allowed' 
                    : 'bg-primary text-black hover:bg-white'
                }`}
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;
