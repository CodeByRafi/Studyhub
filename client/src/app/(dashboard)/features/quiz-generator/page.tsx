"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function QuizGeneratorPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

  const generateQuiz = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setQuestions([
        { q: "What is the primary function of a decentralized ecosystem?", options: ["Central Control", "Distributed Governance", "Data Silos", "Static Infrastructure"], correct: 1 },
        { q: "Which ethical consideration is most critical in modern frameworks?", options: ["Speed", "Scalability", "Algorithmic Bias", "Cost"], correct: 2 },
        { q: "What trend does adaptive learning strategies reflect?", options: ["Static Curriculum", "Rapid Transformation", "Manual Grading", "Fixed Schedules"], correct: 1 }
      ]);
      setStep(2);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Quiz Intelligence</h1>
        <p className="text-zinc-400 text-lg">Test your knowledge with AI-synthesized challenge sequences.</p>
      </div>

      {step === 1 ? (
        <Card className="p-12 space-y-10">
          <div className="space-y-6">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Configuration Phase</h2>
            <div className="space-y-4">
               <label className="block text-sm font-bold text-zinc-300">Input Source Context</label>
               <textarea 
                 placeholder="Paste your study notes or chapter content here to generate a tailored quiz..."
                 className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-zinc-300 focus:border-sky-500 outline-none transition-all placeholder:text-zinc-800"
               />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Difficulty Level</label>
                  <select className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-zinc-400 outline-none focus:border-sky-500">
                     <option>Undergraduate</option>
                     <option>Masters</option>
                     <option>PhD / Expert</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Question Count</label>
                  <select className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-zinc-400 outline-none focus:border-sky-500">
                     <option>5 Questions</option>
                     <option>10 Questions</option>
                     <option>25 Questions</option>
                  </select>
               </div>
            </div>
          </div>

          <Button size="lg" className="w-full h-16 text-lg" onClick={generateQuiz} isLoading={isGenerating}>
            Synthesize Challenge Sequence
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.4em]">Active Challenge: Module 01</h2>
              <div className="flex gap-4">
                 <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400">Time remaining: 12:45</div>
                 <Button variant="outline" size="sm" onClick={() => setStep(1)}>Reset</Button>
              </div>
           </div>

           <div className="space-y-6">
              {questions.map((item, idx) => (
                <Card key={idx} className="p-8 space-y-6">
                   <div className="flex items-start gap-6">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-sky-500">0{idx + 1}</div>
                      <h3 className="text-lg font-bold text-white flex-1">{item.q}</h3>
                   </div>
                   <div className="grid md:grid-cols-2 gap-4 ml-16">
                      {item.options.map((opt: string, i: number) => (
                        <button key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-left text-sm text-zinc-400 font-medium hover:border-sky-500/50 hover:bg-sky-500/5 transition-all">
                           {opt}
                        </button>
                      ))}
                   </div>
                </Card>
              ))}
           </div>

           <Card className="p-8 bg-sky-600 text-white flex items-center justify-between shadow-2xl shadow-sky-900/40">
              <div>
                 <h4 className="text-2xl font-black">CHALLENGE COMPLETE?</h4>
                 <p className="text-sky-100 font-medium opacity-80">Submit your responses for AI-driven evaluation.</p>
              </div>
              <Button variant="secondary" size="lg" className="px-12 bg-white text-sky-600 hover:bg-sky-50" onClick={() => alert("Quiz submitted! You scored 100%.")}>Submit Assessment</Button>
           </Card>
        </div>
      )}
    </div>
  );
}
