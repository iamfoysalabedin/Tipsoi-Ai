
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  return (
    <div className="px-4 pb-4 md:px-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={`relative flex items-end glass rounded-[2rem] border-white/60 transition-all duration-500 input-glow p-2 ${
          isLoading ? 'opacity-60 grayscale-[0.5]' : 'hover:border-indigo-200/50'
        }`}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="যেকোনো কিছু জিজ্ঞাসা করুন..."
            className="w-full bg-transparent rounded-3xl py-3 px-6 focus:outline-none transition-all resize-none max-h-[180px] custom-scrollbar text-[0.98rem] text-slate-800 placeholder-slate-400 font-medium"
            disabled={isLoading}
          />
          <div className="flex-shrink-0 p-1">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 transform active:scale-90 ${
                !input.trim() || isLoading 
                  ? 'bg-slate-200 text-slate-400' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 -rotate-12 hover:rotate-0'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
