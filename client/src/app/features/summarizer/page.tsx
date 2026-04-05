"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function SummarizerPage() {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSummary("");

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }

    setLoading(true);
    // Simulate AI processing (in production, call real AI API)
    setTimeout(() => {
      setSummary(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. \n\n• Key Point 1: The document discusses fundamental concepts in the field\n• Key Point 2: Advanced techniques are introduced in the second section\n• Key Point 3: Practical applications are demonstrated throughout\n• Key Point 4: Conclusions suggest future research directions"
      );
      setLoading(false);
    }, 2000);
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
              📄
            </div>
            <div>
              <h1 className="text-4xl font-bold">PDF Summarizer</h1>
              <p className="text-white/70">Transform long documents into concise, actionable summaries</p>
            </div>
          </div>
        </div>

        {/* Main Tool Area */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6">Upload PDF</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-400/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setSummary("");
                  }}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-white font-medium mb-1">Click to upload PDF</p>
                  <p className="text-white/60 text-sm">or drag and drop</p>
                  {file && <p className="text-green-400 text-sm mt-2">✓ {file.name}</p>}
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Summarizing...
                  </span>
                ) : (
                  "Generate Summary"
                )}
              </button>
            </form>

            {/* Features List */}
            <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
              <h3 className="font-semibold text-white">Features:</h3>
              {[
                "Lightning-fast summarization",
                "Key points extraction",
                "Customizable summary length",
                "Save & export summaries",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-purple-400">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Output Panel */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6">Summary</h2>

            {!summary ? (
              <div className="h-64 flex items-center justify-center border border-dashed border-white/20 rounded-lg">
                <div className="text-center">
                  <div className="text-5xl mb-2">✨</div>
                  <p className="text-white/70">Upload a PDF to see the summary here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-white/90 leading-relaxed whitespace-pre-line text-sm">
                    {summary}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 rounded-lg border border-purple-500/50 bg-purple-500/20 px-4 py-2 font-medium text-purple-300 hover:bg-purple-500/30 transition-all text-sm">
                    📋 Copy Summary
                  </button>
                  <button className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-medium text-white hover:opacity-90 transition-all text-sm">
                    📥 Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload PDF",
                desc: "Select any PDF document from your computer",
              },
              {
                step: "2",
                title: "AI Processing",
                desc: "Our AI analyzes and summarizes the content",
              },
              {
                step: "3",
                title: "Get Summary",
                desc: "Receive concise summary with key points",
              },
            ].map((item,idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
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
