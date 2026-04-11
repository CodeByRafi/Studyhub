"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AITutorPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Greetings scholar. I am your AI Academic Tutor. How can I assist your study session today? I can explain complex theories, solve mathematical problems, or help structure your research." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Regarding "${userMsg.content}", it's essential to analyze it from a multi-disciplinary perspective. In an academic context, this usually involves evaluating the underlying data structures and the socio-technical implications. Would you like me to provide a step-by-step breakdown or recommend some relevant research papers on this topic?` 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Academic Oracle</h1>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">AI Tutor Online</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setMessages([messages[0]])}>Clear Session</Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col bg-zinc-900/40 border-zinc-800">
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-6 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-sky-600 text-white shadow-xl shadow-sky-600/10' 
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                <div className={`mt-2 text-[9px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-sky-200' : 'text-zinc-500'}`}>
                   {msg.role === 'user' ? 'Scholar' : 'AI Tutor'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-zinc-800/50 p-4 rounded-2xl flex gap-1">
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
               </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#09090b] border-t border-zinc-800">
           <form 
             onSubmit={(e) => { e.preventDefault(); handleSend(); }}
             className="relative flex items-center"
           >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your academic oracle anything..."
                className="w-full h-16 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 pr-32 text-white placeholder:text-zinc-700 focus:border-sky-500 outline-none transition-all shadow-inner"
              />
              <div className="absolute right-3 flex gap-2">
                 <Button type="submit" size="sm" className="h-10 px-6 rounded-xl" disabled={!input.trim()}>
                    Query
                 </Button>
              </div>
           </form>
           <p className="text-center text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em] mt-4">AI may display hallucination. Verify critical facts with research resources.</p>
        </div>
      </Card>
      
      <div className="shrink-0 grid grid-cols-3 gap-4">
         <button onClick={() => setInput("Explain Quantum Entanglement simply.")} className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 hover:text-sky-400 hover:border-sky-500/30 transition-all uppercase tracking-tighter text-center">Theoretical explanation</button>
         <button onClick={() => setInput("Can you help me structure my thesis about AI?")} className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 hover:text-sky-400 hover:border-sky-500/30 transition-all uppercase tracking-tighter text-center">Research structuring</button>
         <button onClick={() => setInput("Solve: x^2 + 5x + 6 = 0")} className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 hover:text-sky-400 hover:border-sky-500/30 transition-all uppercase tracking-tighter text-center">Problem solving</button>
      </div>
    </div>
  );
}
