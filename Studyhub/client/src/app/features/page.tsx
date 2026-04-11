"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function FeaturesPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
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
    {
      title: "AI Study Planner",
      description: "Smart schedules, spaced repetition, auto-memo suggestions, and deadline tracking.",
      tag: "Pro",
      icon: "📅",
    },
    {
      title: "Research Paper Recommender",
      description: "Get relevant papers based on your course, topic, and academic year preferences.",
      tag: "Pro",
      icon: "🔬",
    },
    {
      title: "Community Q&A Boards",
      description: "Ask questions and get help from peers and mentors across departments.",
      tag: "Social",
      icon: "💬",
    },
    {
      title: "Job Matching Engine",
      description: "Find internships and part-time roles aligned with your skills and experience.",
      tag: "Career",
      icon: "💼",
    },
    {
      title: "Smart Notes Auto-Tagging",
      description: "Automatically categorize study notes by topic, difficulty, and syllabus section.",
      tag: "AI",
      icon: "🏷️",
    },
    {
      title: "One-Click Reviewer",
      description: "Generate quizzes and flashcards from uploaded notes in seconds.",
      tag: "Pro",
      icon: "⚡",
    },
  ];

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-4">Featured AI Tools</h1>
          <p className="text-xl text-white/70">
            Powerful, easy-to-use AI tools designed to supercharge your studying and learning experience.
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Essential Tools</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {aiTools.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 h-full cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{tool.icon}</div>
                    <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 text-xs font-semibold text-purple-200">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-white/70 mb-6">{tool.description}</p>
                  <div className="space-y-2 mb-6 border-t border-white/10 pt-6">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="text-purple-400">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Use Tool
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Coming Soon</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {premiumFeatures.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
                <div className="mb-3 inline-flex items-center rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200">
                  {feature.tag}
                </div>
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
                <div className="mt-4 flex items-center gap-2 text-purple-400/60 text-sm font-medium">
                  <span>Coming Soon</span>
                  <span>⏳</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Supercharge Your Learning?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Start using our AI tools today and transform the way you study, learn, and prepare for exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white hover:opacity-90 transition-all"
            >
              Sign Up Free
            </Link>
            <Link
              href="/study"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white hover:bg-white/10 transition-all"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </main>
    </div>
  );

  if (user) {
    return <AppLayout>{content}</AppLayout>;
  }
  return content;
}
