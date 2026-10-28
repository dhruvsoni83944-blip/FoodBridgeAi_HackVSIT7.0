import React, { useState } from 'react';
import { chatbotPresets } from '../data/mockData';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Minimize2
} from 'lucide-react';

export const AIAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am FoodBridge AI Assistant. How can I assist you with surplus food donation, freshness verification, or volunteer dispatch today?"
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#1D52F2] hover:bg-[#133BB5] text-white font-bold shadow-2xl shadow-[#1D52F2]/35 transition-all hover:scale-110 active:scale-95 flex items-center gap-2.5 border-2 border-white cursor-pointer"
          title="FoodBridge AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#63A644] animate-ping"></div>
          </div>
          <span className="hidden sm:inline font-black text-sm pr-1">AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Chat Header */}
          <div className="p-4 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#EBF1FE] text-[#1D52F2]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-slate-900">FoodBridge AI</h3>
                  <span className="w-2 h-2 rounded-full bg-[#63A644] animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-500">Online • Food Safety & Dispatch Bot</p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-[#EBF1FE] text-[#1D52F2] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl text-xs max-w-[82%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#1D52F2] text-white font-medium shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-2">
                <Sparkles className="w-3.5 h-3.5 text-[#1D52F2] animate-spin" />
                <span>FoodBridge AI is generating answer...</span>
              </div>
            )}
          </div>

          {/* Preset Quick Chips */}
          <div className="px-3 py-2 border-t border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {chatbotPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-semibold text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Ask about food safety, tax receipts, or status..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-bold shadow-xs transition-transform hover:scale-105 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
