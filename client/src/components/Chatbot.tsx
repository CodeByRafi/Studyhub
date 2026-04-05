"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm StudyHub Assistant. How can I help you today? Ask me about notes, research papers, jobs, or anything else!",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate assistant response (placeholder)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generatePlaceholderResponse(inputValue),
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const generatePlaceholderResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    if (text.includes("note") || text.includes("study")) {
      return "📚 You can browse and download study notes from the Study section. If you're logged in, you can also upload your own notes and help other students!";
    }
    if (text.includes("research") || text.includes("paper")) {
      return "🔬 Check out our Research section to find papers from experts. You can download any paper and browse by topic.";
    }
    if (text.includes("job") || text.includes("intern")) {
      return "💼 Explore job opportunities and internships in our Jobs section. Create an account to apply for positions!";
    }
    if (text.includes("connect") || text.includes("mentor")) {
      return "🤝 Visit our Connection page to network with peers and find mentors in your field. Great for career guidance!";
    }
    if (text.includes("how") || text.includes("help")) {
      return "I can help you with:\n• Finding study materials\n• Browsing research papers\n• Exploring job opportunities\n• Networking with mentors\n\nWhat would you like to know?";
    }

    return "That's a great question! 🤔 I'm here to help you navigate StudyHub. Feel free to ask me about any of our features like notes, research, jobs, or networking!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/40 flex items-center justify-center cursor-pointer transition-all hover:scale-110 z-40 ${
          isOpen ? "scale-95" : ""
        }`}
        aria-label="Open chat"
      >
        <span className="text-2xl">{isOpen ? "✕" : "💬"}</span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-96 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] shadow-2xl shadow-purple-500/20 overflow-hidden z-40 flex flex-col animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">StudyHub Assistant</h3>
              <p className="text-xs text-white/60">Always here to help</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20"
                      : "bg-white/10 text-white/90 border border-white/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/90 border border-white/10 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400/50 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-white/40 text-center">Press Enter to send</p>
          </div>
        </div>
      )}
    </>
  );
}
