import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { chatbotPresets } from '../data/mockData';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  HelpCircle,
  Minimize2
} from 'lucide-react';

export const AIAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am FoodBridge AI Assistant 🌿. How can I assist you with surplus food donation, freshness verification, or volunteer dispatch today?"
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "FoodBridge AI monitors safety, routing, and shelter capacity. How else can I assist you?";
      
      const lower = text.toLowerCase();
      if (lower.includes("how does foodbridge ai match") || lower.includes("matching")) {
        aiResponseText = "Our AI Smart Match engine evaluates 3 primary vectors: 1) Food Decay Window (freshness timer), 2) Spatial Proximity Matrix (distance in km between donor, volunteer & shelter), and 3) Real-time Shelter Capacity to guarantee sub-15 minute dispatch with 98%+ match precision.";
      } else if (lower.includes("what types of food") || lower.includes("donate")) {
        aiResponseText = "You can donate: 1) Freshly prepared hot meals (buffet surplus), 2) Artisan bakery items & bread, 3) Raw farm produce & fruits, 4) Sealed packaged groceries, and 5) Beverages. Food must be stored hygienically.";
      } else if (lower.includes("tax") || lower.includes("deduction") || lower.includes("savings")) {
        aiResponseText = "All registered donations on FoodBridge AI generate automated Section 80G / 501(c)(3) digital tax receipts based on fair market meal valuations upon NGO delivery confirmation!";
      } else if (lower.includes("safety") || lower.includes("freshness")) {
        aiResponseText = "Food safety is guaranteed via our AI Vision Scanner. Cooked food should be donated within 4-6 hours of preparation and kept above 60°C (140°F) or under 4°C (40°F) for refrigerated items.";
      } else {
        aiResponseText = `Thank you for your question regarding "${text}". FoodBridge AI has logged this query. If you have an active donation, our automated neural dispatch is already finding the closest verified NGO shelter!`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponseText }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating launcher button in bottom-right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-bold shadow-2xl shadow-emerald-500/40 transition-all hover:scale-110 active:scale-95 flex items-center gap-3 border border-emerald-300/40"
          title="FoodBridge AI Assistant"
        >
          <div className="relative">
            <Bot className="w-7 h-7" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-300 animate-ping"></div>
          </div>
          <span className="hidden sm:inline font-extrabold text-sm pr-1">AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] glass-panel rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Chat Header */}
          <div className="p-4 bg-emerald-950/90 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">FoodBridge AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-400">Online • Food Safety & Dispatch Bot</p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-900/40"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-500 text-emerald-950 font-semibold shadow-md'
                    : 'bg-emerald-950/90 border border-emerald-500/30 text-slate-200 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>FoodBridge AI is generating answer...</span>
              </div>
            )}
          </div>

          {/* Preset Quick Chips */}
          <div className="px-3 py-2 border-t border-emerald-500/10 bg-emerald-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {chatbotPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="px-2.5 py-1 rounded-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/20 text-[10px] font-semibold text-emerald-300 whitespace-nowrap"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-emerald-950 border-t border-emerald-500/20 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Ask about food safety, tax receipts, or status..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-md transition-transform hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
