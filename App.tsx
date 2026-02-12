
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Role, Message, ChatState } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { sendMessageStream, ModelType } from './services/deepseekService';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelType>('pro');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: 'initial',
        role: Role.BOT,
        content: "Welcome to Tipsoi AI! আমি আপনাকে আজ কীভাবে সাহায্য করতে পারি?",
        timestamp: new Date()
      }
    ],
    isLoading: false,
    error: null
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    const startTime = Date.now();
    setElapsedSeconds(0);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds(prev => +(prev + 0.1).toFixed(1));
    }, 100);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const history = state.messages
        .filter(m => m.id !== 'initial' && m.content !== '') 
        .map(m => ({
          role: m.role === Role.USER ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

      let fullContent = '';
      let botMessageId = '';
      
      // Both models use the same unified backend call
      await sendMessageStream(text, history, selectedModel, (chunk) => {
        if (!botMessageId) {
          botMessageId = (Date.now() + 1).toString();
          fullContent = chunk;
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, {
              id: botMessageId,
              role: Role.BOT,
              content: fullContent,
              timestamp: new Date()
            }]
          }));
        } else {
          fullContent += chunk;
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(m => 
              m.id === botMessageId ? { ...m, content: fullContent } : m
            )
          }));
        }
      });

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const totalTime = +((Date.now() - startTime) / 1000).toFixed(1);
      
      if (botMessageId) {
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(m => 
            m.id === botMessageId ? { ...m, responseTime: totalTime } : m
          )
        }));
      }

    } catch (err: any) {
      if (timerRef.current) clearInterval(timerRef.current);
      setState(prev => ({
        ...prev,
        error: err.message,
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Immersive Header */}
      <header className="glass border-b border-white/40 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="https://play-lh.googleusercontent.com/mk999AcHEy0JMt4TJCPW_XQL0nwaC83h7rtkgSwYmyjhq-oyECCnyS6kFiWWgAQrIV8=w480-h960-rw" 
              alt="Tipsoi Logo" 
              className="relative w-10 h-10 rounded-xl shadow-lg object-cover"
            />
          </div>
          <h1 className="font-extrabold text-slate-900 text-xl tracking-tight">
            Tipsoi <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
          </h1>
        </div>
        
        <div className="flex items-center relative" ref={menuRef}>
          <button 
            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
            className="flex items-center gap-2.5 px-4 py-1.5 bg-white/50 hover:bg-white/80 rounded-full border border-white/60 transition-all group shadow-sm"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {selectedModel === 'thinking' ? 'Polok 1.0 Think' : 'Polok 5.1 Pro (Fast)'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {isModelMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 glass-card rounded-2xl shadow-2xl z-[60] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => { setSelectedModel('thinking'); setIsModelMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-indigo-50/50 transition-colors ${selectedModel === 'thinking' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
              >
                <span>Polok 1.0 Think (Reasoning)</span>
                {selectedModel === 'thinking' && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-glow"></div>}
              </button>
              <button
                onClick={() => { setSelectedModel('pro'); setIsModelMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-indigo-50/50 transition-colors ${selectedModel === 'pro' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
              >
                <span>Polok 5.1 Pro (Fast)</span>
                {selectedModel === 'pro' && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-glow"></div>}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-8 px-4 md:px-8 custom-scrollbar scroll-smooth"
      >
        <div className="max-w-4xl mx-auto pb-12">
          {state.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {/* Thinking Indicator */}
          {state.isLoading && state.messages[state.messages.length - 1]?.role === Role.USER && (
            <div className="flex justify-start items-start gap-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden glass-card p-0.5">
                <img 
                  src="https://play-lh.googleusercontent.com/mk999AcHEy0JMt4TJCPW_XQL0nwaC83h7rtkgSwYmyjhq-oyECCnyS6kFiWWgAQrIV8=w480-h960-rw" 
                  className="w-full h-full object-cover grayscale opacity-60"
                  alt="Thinking"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-5 py-3 glass-card rounded-2xl rounded-tl-none border-white/60">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Thinking</span>
                </div>
                <div className="flex items-center gap-1.5 ml-1">
                  <span className="text-[10px] font-bold text-indigo-500/70">{elapsedSeconds.toFixed(1)}s</span>
                  <div className="w-24 h-[3px] bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 animate-pulse w-full origin-left"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {state.error && (
            <div className="max-w-lg mx-auto mt-6 p-4 glass rounded-2xl border-red-200/50 bg-red-50/30 text-red-600 text-sm font-medium flex items-center gap-4 shadow-xl">
              <div className="bg-red-500 text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </div>
              {state.error}
            </div>
          )}
        </div>
      </main>

      {/* Floating Input area */}
      <footer className="relative z-10 w-full pt-2">
        <ChatInput onSendMessage={handleSendMessage} isLoading={state.isLoading} />
        <div className="text-center pb-4 pt-1">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
             <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-slate-300"></span>
             TIPSOI AI INTELLIGENCE
             <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-slate-300"></span>
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
