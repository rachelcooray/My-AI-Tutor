import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

export default function ChatInterface({ subject, mode }) {
    const [messages, setMessages] = useState([
        { role: 'ai', content: `Hello! I'm your ${subject} tutor. I'm ready to ${mode === 'EXPLAIN' ? 'explain concepts' : 'solve questions'} based on your material.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset chat when subject changes (optional, but good for context switching)
    useEffect(() => {
        setMessages([{
            role: 'ai',
            content: `Switched to **${subject}** mode. How can I help you with ${subject} today?`
        }]);
    }, [subject]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:3000/api/chat', {
                message: userMsg.content,
                subject,
                mode
            });

            const aiMsg = { role: 'ai', content: res.data.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "flex gap-4 max-w-3xl",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-slate-700 text-white" : "bg-blue-600 text-white"
                        )}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div className={clsx(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-slate-800 text-white rounded-tr-sm"
                                : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm prose prose-sm max-w-none"
                        )}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 max-w-3xl mr-auto">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                            <Sparkles size={16} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'EXPLAIN' ? "Ask to explain a concept..." : "Paste a question to solve..."}
                        className="w-full pl-6 pr-14 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-xs text-slate-400">
                        AI can make mistakes. Always verify with official CIMA syllabus.
                    </p>
                </div>
            </div>
        </div>
    );
}
