import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, Minimize2, Bot } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am Ayushi, your personal shopping assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const initializeChat = () => {
    if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: "You are Ayushi, a friendly, enthusiastic, and knowledgeable AI shopping assistant for 'AyushiMart' (an e-commerce platform similar to Flipkart). Your goal is to help users find products, answer questions about orders, shipping, and returns, and provide product recommendations based on their needs. Keep your responses concise and helpful. Use emojis occasionally to maintain a friendly tone.",
            }
        });
    }
  };

  const toggleChat = () => {
    if (!isOpen && !chatRef.current) {
        initializeChat();
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't generate a response." }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center gap-2 group"
          aria-label="Open Chat"
        >
          <MessageCircle size={28} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium pl-0 group-hover:pl-2">Chat with Ayushi</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] md:w-[380px] h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden font-sans animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                    <Bot size={20} className="text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-sm tracking-wide">Ayushi Assistant</h3>
                    <p className="text-[10px] text-blue-100 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span> Online
                    </p>
                </div>
            </div>
            <button onClick={toggleChat} className="text-blue-100 hover:text-white transition-colors bg-blue-700/50 p-1.5 rounded-md hover:bg-blue-700">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-[85%] p-3 text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-xs text-gray-500 font-medium">Ayushi is thinking...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about products..."
                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-95 flex-shrink-0"
              >
                <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
              </button>
            </form>
            <div className="text-[9px] text-center text-gray-400 mt-2 font-medium tracking-wide">
                POWERED BY GEMINI AI
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;