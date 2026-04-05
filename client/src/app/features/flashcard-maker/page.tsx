"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function FlashcardMakerPage() {
  const [user, setUser] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFlashcards([]);
    setCurrentCard(0);
    setIsFlipped(false);

    if (!text.trim()) {
      setError("Please enter some study material or notes");
      return;
    }

    setLoading(true);
    // Simulate flashcard generation (in production, call real AI API)
    setTimeout(() => {
      setFlashcards([
        {
          id: 1,
          question: "What is photosynthesis?",
          answer: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of glucose.",
        },
        {
          id: 2,
          question: "Define mitochondria",
          answer: "Mitochondria are membrane-bound organelles that generate energy for the cell in the form of ATP through the process of cellular respiration.",
        },
        {
          id: 3,
          question: "What is the function of the nucleus?",
          answer: "The nucleus controls cellular activities and stores genetic information (DNA). It regulates gene expression and cell division.",
        },
        {
          id: 4,
          question: "Explain osmosis",
          answer: "Osmosis is the movement of water molecules across a semi-permeable membrane from an area of higher water concentration to lower water concentration.",
        },
        {
          id: 5,
          question: "What is ATP?",
          answer: "ATP (Adenosine Triphosphate) is the primary energy currency of cells, providing the energy needed for cellular processes.",
        },
        {
          id: 6,
          question: "Define enzyme",
          answer: "Enzymes are biological catalysts that speed up chemical reactions in cells without being consumed in the process.",
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
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
              🎴
            </div>
            <div>
              <h1 className="text-4xl font-bold">Flashcard Maker</h1>
              <p className="text-white/70">Create beautiful, interactive flashcards for efficient studying</p>
            </div>
          </div>
        </div>

        {flashcards.length === 0 ? (
          // Input Section
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Create Flashcards</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Paste Study Material
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your notes, definitions, or study material. AI will automatically create flashcards..."
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
                    Creating Flashcards...
                  </span>
                ) : (
                  "Create Flashcards"
                )}
              </button>
            </form>

            {/* Features List */}
            <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
              <h3 className="font-semibold text-white">Features:</h3>
              {[
                "AI-powered flashcard generation",
                "Beautiful card design",
                "Spaced repetition support",
                "Export & share decks",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-purple-400">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Flashcard Study Section
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  Card {currentCard + 1} of {flashcards.length}
                </h2>
                <span className="text-white/70 text-sm">
                  {Math.round(((currentCard + 1) / flashcards.length) * 100)}% complete
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${((currentCard + 1) / flashcards.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Flashcard */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="h-96 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-purple-400/50 group"
            >
              <div className="text-sm text-white/60 mb-4">
                {isFlipped ? "Answer" : "Question"}
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold leading-tight mb-4">
                  {isFlipped
                    ? flashcards[currentCard].answer
                    : flashcards[currentCard].question}
                </p>
              </div>
              <div className="mt-auto text-white/50 text-sm">
                Click to {isFlipped ? "see question" : "reveal answer"}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex gap-3 justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentCard === 0}
                className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-medium text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentCard(i);
                      setIsFlipped(false);
                    }}
                    className={`h-10 w-10 rounded-full font-semibold transition-all ${
                      currentCard === i
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "border border-white/20 text-white/70 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentCard === flashcards.length - 1}
                className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-medium text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>

            {/* Study Again Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setFlashcards([]);
                  setText("");
                  setCurrentCard(0);
                  setIsFlipped(false);
                }}
                className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-semibold text-white hover:opacity-90 transition-all"
              >
                Create New Deck
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
