
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
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
          <div className={`px-5 py-4 rounded-3xl transition-all duration-300 ${
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
          
          <div className={`flex items-center gap-3 mt-2 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-60">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.responseTime !== undefined && !isUser && (
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-indigo-300 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-indigo-500 font-black tracking-tighter uppercase">
                  Processed in {message.responseTime}s
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
