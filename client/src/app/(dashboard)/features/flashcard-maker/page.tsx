"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FlashcardMakerPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateCards = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCards([
        { front: "Decentralized Ecosystem", back: "An infrastructure where control and decision-making are distributed across a network rather than centralized in a single entity." },
        { front: "Algorithmic Bias", back: "Systematic and repeatable errors in a computer system that create unfair outcomes, such as privileging one arbitrary group of users over others." },
        { front: "Adaptive Learning", back: "An educational method which uses computer algorithms to orchestrate the interaction with the learner and deliver customized resources and learning activities to address the unique needs of each learner." }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight uppercase tracking-tighter">Memory Synthesis</h1>
        <p className="text-zinc-400 text-lg">Master complex concepts through AI-generated spaced repetition decks.</p>
      </div>

      {cards.length === 0 ? (
        <Card className="p-16 text-center space-y-10 border-sky-500/10 bg-sky-500/[0.01]">
          <div className="space-y-4">
             <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-2xl">🎴</div>
             <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Create intelligence decks</h2>
                <p className="text-zinc-500 max-w-sm mx-auto">Transform your research papers or class notes into optimized memorization assets.</p>
             </div>
          </div>

          <div className="space-y-6">
             <textarea 
               placeholder="Paste content to transform into flashcards..."
               className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 text-zinc-300 focus:border-sky-500 outline-none transition-all"
             />
             <Button size="lg" className="w-full h-16 text-lg" onClick={generateCards} isLoading={isGenerating}>
                Generate Memory Deck
             </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-12">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="text-xs font-black text-sky-500 uppercase tracking-[0.3em]">Active Session</h3>
                 <p className="text-zinc-500 font-bold text-sm">Card {currentIndex + 1} of {cards.length}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setCards([]); setCurrentIndex(0); setIsFlipped(false); }}>New Deck</Button>
           </div>

           <div className="group h-80 w-full perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative h-full w-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                 {/* Front */}
                 <div className="absolute inset-0 backface-hidden">
                    <Card className="h-full w-full flex items-center justify-center p-12 text-center border-zinc-700 bg-zinc-900 shadow-2xl">
                       <h4 className="text-3xl font-black text-white tracking-tight uppercase leading-tight">{cards[currentIndex].front}</h4>
                       <div className="absolute bottom-8 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Click to reveal context</div>
                    </Card>
                 </div>
                 {/* Back */}
                 <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <Card className="h-full w-full flex items-center justify-center p-12 text-center border-sky-500/30 bg-sky-500/[0.03] shadow-2xl">
                       <p className="text-lg text-zinc-300 font-medium leading-relaxed">{cards[currentIndex].back}</p>
                       <div className="absolute bottom-8 text-[10px] font-black text-sky-500 uppercase tracking-widest">Knowledge synthesized</div>
                    </Card>
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
               <Button 
                 variant="secondary" 
                 className="h-16 rounded-2xl"
                 onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => Math.max(0, prev - 1)); setIsFlipped(false); }}
                 disabled={currentIndex === 0}
               >
                 Previous Concept
               </Button>
               <Button 
                 variant="secondary"
                 className="h-16 rounded-2xl"
                 onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
               >
                 Flip Intelligence
               </Button>
               <Button 
                 className="h-16 rounded-2xl"
                 onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => Math.min(cards.length - 1, prev + 1)); setIsFlipped(false); }}
                 disabled={currentIndex === cards.length - 1}
               >
                 Next Concept
               </Button>
           </div>

           <Card className="p-8 bg-zinc-900/40 border-zinc-800 space-y-4">
              <h5 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Deck Master stats</h5>
              <div className="grid grid-cols-3 gap-10">
                 <div>
                    <p className="text-2xl font-black text-white">84%</p>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Retention Rate</p>
                 </div>
                 <div>
                    <p className="text-2xl font-black text-white">12m</p>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Avg. Focus Time</p>
                 </div>
                 <div>
                    <p className="text-2xl font-black text-white">Gold</p>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Academic Rank</p>
                 </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
