
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Role } from '../types.ts';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setFeedback(prev => prev === 'like' ? null : 'like');
  };

  const handleDislike = () => {
    setFeedback(prev => prev === 'dislike' ? null : 'dislike');
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up group`}>
      <div className={`flex max-w-[90%] md:max-w-[82%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
        {/* Avatar Container */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 overflow-hidden border border-white/40 ${
          isUser ? 'bg-indigo-600 order-1' : 'glass-card p-0.5'
        }`}>
          {isUser ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          ) : (
            <img 
              src="https://play-lh.googleusercontent.com/mk999AcHEy0JMt4TJCPW_XQL0nwaC83h7rtkgSwYmyjhq-oyECCnyS6kFiWWgAQrIV8=w480-h960-rw" 
              alt="Tipsoi" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}>
          <div className={`px-5 py-4 rounded-3xl transition-all duration-300 relative ${
            isUser 
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xl shadow-indigo-200/50 rounded-tr-none' 
              : 'glass-card text-slate-800 border-white/80 rounded-tl-none shadow-sm'
          }`}>
            {isUser ? (
              <p className="text-[0.98rem] whitespace-pre-wrap leading-relaxed font-medium tracking-tight">{message.content}</p>
            ) : (
              <div className="prose prose-slate prose-invert-none max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Action Bar */}
          <div className={`flex items-center gap-3 mt-2 px-2 transition-opacity duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-60">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            <div className="flex items-center gap-1 bg-white/40 backdrop-blur-sm rounded-full p-0.5 border border-white/60">
              <button 
                onClick={handleCopy}
                className={`p-1.5 rounded-full transition-all hover:bg-white/80 ${copied ? 'text-green-500' : 'text-slate-400 hover:text-indigo-500'}`}
                title="Copy Message"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                )}
              </button>

              {!isUser && (
                <>
                  <button 
                    onClick={handleLike}
                    className={`p-1.5 rounded-full transition-all hover:bg-white/80 ${feedback === 'like' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-indigo-500'}`}
                    title="Helpful"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={feedback === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
                  </button>
                  <button 
                    onClick={handleDislike}
                    className={`p-1.5 rounded-full transition-all hover:bg-white/80 ${feedback === 'dislike' ? 'text-red-600 bg-red-50/50' : 'text-slate-400 hover:text-red-500'}`}
                    title="Not Helpful"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={feedback === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path></svg>
                  </button>
                </>
              )}
            </div>

            {message.responseTime !== undefined && !isUser && (
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-indigo-300 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-indigo-500 font-black tracking-tighter uppercase">
                  {message.responseTime}s
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
