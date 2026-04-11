"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getResearch, uploadResearch } from "@/services/research";
import { recordVisit } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function ResearchPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [research, setResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    fetchResearch();
    recordVisit("research");
  }, []);

  const fetchResearch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getResearch();
      setResearch(data);
    } catch (err: any) {
      setError("Failed to load research papers. Please refresh the page.");
      console.error("Error fetching research:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");

    if (!title.trim()) {
      setUploadError("Please enter a title for the research paper.");
      return;
    }

    if (!file) {
      setUploadError("Please select a PDF file to upload.");
      return;
    }

    if (!user) {
      localStorage.setItem("intendedRoute", "/research");
      router.push("/login");
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be less than 50MB.");
      return;
    }

    setUploading(true);
    try {
      const token = getToken();
      const result = await uploadResearch(title.trim(), abstract.trim(), file, token!);

      if (result) {
        setTitle("");
        setAbstract("");
        setFile(null);
        setShowUploadForm(false);
        await fetchResearch();
      } else {
        setUploadError("Failed to upload research paper. Please try again.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload research paper. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (paper: any) => {
    if (paper.file_url) {
      try {
        const link = document.createElement('a');
        link.href = paper.file_url;
        link.download = `${paper.title}.pdf`;
        link.target = '_blank';
        link.click();
      } catch (err) {
        console.error("Download error:", err);
        setError("Failed to download the file. Please try again.");
      }
    }
  };

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Upload Button */}
        {user && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
            >
              {showUploadForm ? "Cancel Upload" : "Upload Research"}
            </button>
          </div>
        )}

        {/* Upload Form */}
        {user && showUploadForm && (
          <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-purple-400">📄</span>
              Upload Research Paper
            </h2>

            {uploadError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  {uploadError}
                </div>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Paper Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Machine Learning Applications in Healthcare"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Abstract (Optional)
                </label>
                <textarea
                  placeholder="Brief summary of the research paper..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  PDF File *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-purple-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  />
                  {file && (
                    <div className="mt-2 text-sm text-green-400">
                      ✓ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </div>
                  ) : (
                    "Upload Research Paper"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Guest Notice */}
        {!user && (
          <div className="mb-8 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔬</span>
              <h3 className="text-lg font-semibold">Explore Research Papers</h3>
            </div>
            <p className="text-white/80 mb-4">
              You can browse and download all research papers. To contribute your own research, please{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                sign in
              </Link>
              {" "}or{" "}
              <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-medium">
                create an account
              </Link>
              .
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Research List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Academic Research
            </h2>
            <span className="text-white/60 text-sm">
              {research.length} {research.length === 1 ? "paper" : "papers"} available
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-white/70">Loading research papers...</p>
              </div>
            </div>
          ) : research.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-2">No research papers found</h3>
              <p className="text-white/60 mb-6">
                No research papers have been uploaded yet.
              </p>
              {user && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
                >
                  Upload the First Paper
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {research.map((paper) => (
                <Link key={paper.id} href={`/research/${paper.id}`}>
                  <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-purple-300 transition-colors">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-white/60 mb-1">
                          by {paper.first_name} {paper.last_name}
                        </p>
                        <p className="text-xs text-white/50">
                          {new Date(paper.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                        📄
                      </div>
                    </div>

                    {paper.abstract && (
                      <p className="text-sm text-white/70 mb-4 line-clamp-3 leading-relaxed">
                        {paper.abstract}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm font-medium">
                            {paper.average_rating || "0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-400 text-sm">💬</span>
                          <span className="text-sm font-medium">
                            {paper.comment_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(paper);
                      }}
                      className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:scale-105"
                    >
                      ⬇️ Download PDF
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );

  if (user) {
    return <AppLayout>{content}</AppLayout>;
  }
  return content;
}
