"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function QuizGeneratorPage() {
  const [user, setUser] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setQuizzes([]);
    setShowResults(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});

    if (!text.trim()) {
      setError("Please enter some study material or notes");
      return;
    }

    setLoading(true);
    // Simulate quiz generation (in production, call real AI API)
    setTimeout(() => {
      setQuizzes([
        {
          id: 1,
          question: "What is the primary concept discussed in the text?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
        },
        {
          id: 2,
          question: "Which of the following is an example from the material?",
          options: ["Example 1", "Example 2", "Example 3", "Example 4"],
          correct: 2,
        },
        {
          id: 3,
          question: "What is the significance of this concept?",
          options: ["Reason 1", "Reason 2", "Reason 3", "Reason 4"],
          correct: 1,
        },
        {
          id: 4,
          question: "How does this relate to other topics?",
          options: ["Connection A", "Connection B", "Connection C", "Connection D"],
          correct: 3,
        },
        {
          id: 5,
          question: "What would be the outcome if...?",
          options: ["Outcome 1", "Outcome 2", "Outcome 3", "Outcome 4"],
          correct: 0,
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizzes.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.options[q.correct]) {
        correct++;
      }
    });
    return Math.round((correct / quizzes.length) * 100);
  };

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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
              ❓
            </div>
            <div>
              <h1 className="text-4xl font-bold">Quiz Generator</h1>
              <p className="text-white/70">Create interactive quizzes from your study notes instantly</p>
            </div>
          </div>
        </div>

        {quizzes.length === 0 ? (
          // Input Section
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Generate Quiz</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Paste Study Material or Notes
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your study notes, lecture content, or any text you want to create a quiz from..."
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  rows={8}
                />
              </div>

              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Generating Quiz...
                  </span>
                ) : (
                  "Generate Quiz"
                )}
              </button>
            </form>

            {/* Features List */}
            <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
              <h3 className="font-semibold text-white">Features:</h3>
              {[
                "Auto-generate multiple choice questions",
                "Customizable difficulty levels",
                "Instant feedback and scoring",
                "Track your progress",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-purple-400">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ) : !showResults ? (
          // Quiz Section
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  Question {currentQuestion + 1} of {quizzes.length}
                </h2>
                <span className="text-white/70 text-sm">
                  {Object.keys(selectedAnswers).length}/{quizzes.length} answered
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / quizzes.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-6">
                {quizzes[currentQuestion].question}
              </h3>

              <div className="space-y-3 mb-8">
                {quizzes[currentQuestion].options.map((option: string, idx: number) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      selectedAnswers[currentQuestion] === option
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={option}
                      checked={selectedAnswers[currentQuestion] === option}
                      onChange={() => handleAnswerSelect(option)}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-medium">{option}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 font-medium text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                {currentQuestion === quizzes.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length < quizzes.length}
                    className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-medium text-white hover:opacity-90 transition-all"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Results Section
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {calculateScore()}%
              </div>
              <h2 className="text-2xl font-semibold mb-2">Quiz Complete!</h2>
              <p className="text-white/70 mb-8">
                You answered {Object.keys(selectedAnswers).filter((key) => {
                  const idx = parseInt(key);
                  return selectedAnswers[idx] === quizzes[idx].options[quizzes[idx].correct];
                }).length} out of {quizzes.length} questions correctly.
              </p>

              <button
                onClick={() => {
                  setQuizzes([]);
                  setText("");
                  setSelectedAnswers({});
                  setShowResults(false);
                  setCurrentQuestion(0);
                }}
                className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-semibold text-white hover:opacity-90 transition-all"
              >
                Create New Quiz
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  if (user) {
    return <AppLayout>{content}</AppLayout>;
  }
  return content;
}
