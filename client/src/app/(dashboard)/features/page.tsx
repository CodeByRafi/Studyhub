"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FeaturesPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const aiTools = [
    {
      id: "summarizer",
      title: "PDF Summarizer",
      description: "Transform long documents into concise, actionable summaries powered by AI.",
      icon: "📄",
      href: "/features/summarizer",
      badge: "Popular",
      features: ["Lightning-fast", "Key points extraction", "Customizable length"],
    },
    {
      id: "quiz",
      title: "Quiz Generator",
      description: "Create interactive quizzes from your study notes instantly with instant feedback.",
      icon: "❓",
      href: "/features/quiz-generator",
      badge: "New",
      features: ["Auto-generate questions", "Track score", "Detailed feedback"],
    },
    {
      id: "flashcards",
      title: "Flashcard Maker",
      description: "Create beautiful, interactive flashcards for efficient studying and memorization.",
      icon: "🎴",
      href: "/features/flashcard-maker",
      badge: "Trending",
      features: ["Spaced repetition", "Beautiful design", "Export decks"],
    },
    {
      id: "tutor",
      title: "AI Tutor",
      description: "Get personalized help with any subject, concept, or problem explained clearly.",
      icon: "🧑‍🎓",
      href: "/features/ai-tutor",
      badge: "Smart",
      features: ["24/7 availability", "Step-by-step help", "Multi-subject support"],
    },
  ];

  const premiumFeatures = [
    { title: "AI Study Planner", description: "Smart schedules and deadline tracking.", tag: "Pro", icon: "📅" },
    { title: "Research Recommender", description: "Get relevant papers based on your topic.", tag: "Pro", icon: "🔬" },
    { title: "Community Q&A", description: "Get help from peers and mentors.", tag: "Social", icon: "💬" },
    { title: "Job Matching", description: "Find internships aligned with your skills.", tag: "Career", icon: "💼" },
    { title: "Auto-Tagging", description: "Categorize notes by topic automatically.", tag: "AI", icon: "🏷️" },
    { title: "Reviewer", description: "Generate summaries in seconds.", tag: "Pro", icon: "⚡" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Featured AI Tools</h1>
        <p className="text-zinc-400 text-lg">Powerful AI agents designed to supercharge your academic journey.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {aiTools.map((tool) => (
          <Link key={tool.id} href={tool.href}>
            <Card hoverable className="p-8 h-full flex flex-col group border-sky-500/5 hover:border-sky-500/30">
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <span className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                  {tool.badge}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors uppercase tracking-tight">{tool.title}</h3>
                <p className="text-zinc-400 leading-relaxed mb-8">{tool.description}</p>
                
                <div className="space-y-3 mb-8 border-t border-zinc-900 pt-8">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-zinc-500">
                      <span className="text-sky-500">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sky-500 font-black text-sm uppercase tracking-widest group-hover:gap-5 transition-all">
                Execute Agent
                <span className="text-xl">→</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="space-y-8 pt-12">
        <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.4em]">Deep Intelligence / Coming Soon</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {premiumFeatures.map((feature) => (
            <Card key={feature.title} className="p-6 space-y-4 bg-zinc-900/40 border-zinc-800/50">
              <div className="flex items-center justify-between">
                 <div className="text-2xl">{feature.icon}</div>
                 <span className="px-2 py-0.5 bg-zinc-800 rounded text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{feature.tag}</span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">{feature.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-12 text-center bg-sky-600 font-black text-white rounded-[3rem] shadow-[0_20px_50px_rgba(2,132,199,0.3)] border-none relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
         <div className="relative">
            <h2 className="text-3xl mb-4">WANT TO BUILD YOUR OWN AI?</h2>
            <p className="text-sky-100 text-sm mb-8 max-w-lg mx-auto font-medium">Join our developer ecosystem and contribute to the next generation of academic AI agents.</p>
            <Button variant="secondary" size="lg" className="rounded-2xl px-12 bg-white text-sky-600 hover:bg-zinc-100">Contact Partnership</Button>
         </div>
      </Card>
    </div>
  );
}
