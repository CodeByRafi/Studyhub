"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function AITutorPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      type: "assistant",
      text: "Hello! I'm your AI Tutor. I'm here to help you understand any concept, solve problems, or prepare for exams. What would you like to learn about today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: input,
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response (in production, call real AI API)
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: "assistant",
        text: "That's a great question! Let me explain this concept for you. The key idea is that...\n\n• First point: Understanding the fundamentals\n• Second point: How it applies in practice\n• Third point: Common misconceptions to avoid\n\nWould you like me to expand on any of these points?",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 text-sm"
          >
            <span>←</span>
            Back to Features
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
              🧑‍🎓
            </div>
            <div>
              <h1 className="text-4xl font-bold">AI Tutor</h1>
              <p className="text-white/70">Get personalized help with any subject or topic</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-lg rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "border border-white/20 bg-white/5 text-white/90"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/20 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"></div>
                    <div
                      className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Topics */}
          {messages.length === 1 && (
            <div className="px-6 pb-4 border-b border-white/10">
              <p className="text-sm text-white/70 mb-3">Try asking about:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Photosynthesis",
                  "Calculus Derivatives",
                  "World War II",
                  "Python Programming",
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setInput(topic)}
                    className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-white/10 p-6 bg-black/20">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
            <p className="text-xs text-white/50 mt-2">
              AI Tutor can make mistakes. Important topics should be verified with reliable sources.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Features:</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: "💡",
                title: "Explain Concepts",
                desc: "Ask about any topic and get detailed explanations",
              },
              {
                icon: "🧮",
                title: "Solve Problems",
                desc: "Get step-by-step solutions to problems",
              },
              {
                icon: "📝",
                title: "Essay Feedback",
                desc: "Get feedback on your essays and writings",
              },
              {
                icon: "🗂️",
                title: "Study Guides",
                desc: "Generate study guides for any topic",
              },
            ].map((feature, idx) => (
              <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.desc}</p>
              </div>
            ))}
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
