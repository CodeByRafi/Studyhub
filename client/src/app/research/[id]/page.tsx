"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getResearchById, getResearchComments, addResearchComment, addResearchRating } from "@/services/research";
import { API_URL } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";

export default function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [research, setResearch] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    fetchResearch();
    fetchComments();
  }, [id]);

  const fetchResearch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getResearchById(id);
      if (data) {
        setResearch(data);
        setRating(data.average_rating || 0);
      } else {
        setResearch(null);
      }
    } catch (err: any) {
      setError("Failed to load research paper. Please refresh the page.");
      console.error("Error fetching research:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const data = await getResearchComments(id);
      setComments(data || []);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommentError("");

    if (!commentText.trim()) {
      setCommentError("Please enter a comment.");
      return;
    }

    if (!user) {
      setCommentError("Please login to add comments.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const result = await addResearchComment(id, commentText.trim(), token!);

      if (result) {
        setCommentText("");
        await fetchComments();
      } else {
        setCommentError("Failed to add comment. Please try again.");
      }
    } catch (err: any) {
      setCommentError(err.message || "Failed to add comment. Please try again.");
      console.error("Comment error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRating = async (value: number) => {
    setRatingError("");

    if (!user) {
      setRatingError("Please login to add ratings.");
      return;
    }

    setUserRating(value);
    try {
      const token = getToken();
      const result = await addResearchRating(id, value, token!);

      if (result) {
        // Refresh the research to get updated average rating
        await fetchResearch();
      } else {
        setRatingError("Failed to add rating. Please try again.");
      }
    } catch (err: any) {
      setRatingError(err.message || "Failed to add rating. Please try again.");
      console.error("Rating error:", err);
    }
  };

  const handleDownload = () => {
    if (research?.file_url) {
      try {
        const link = document.createElement('a');
        const fullUrl = research.file_url.startsWith('http') ? research.file_url : `${API_URL}${research.file_url}`;
        link.href = fullUrl;
        link.download = `${research.title}.pdf`;
        link.target = '_blank';
        link.click();
      } catch (err) {
        console.error("Download error:", err);
        setError("Failed to download the file. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-white/70">Loading research paper...</p>
        </div>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔬</div>
          <h1 className="text-2xl font-bold mb-2">Research Paper Not Found</h1>
          <p className="text-white/60 mb-6">The research paper you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/research"
            className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
          >
            Back to Research Papers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            <span>←</span>
            Back to Research Papers
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Research Header */}
        <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 leading-tight">{research.title}</h1>
              <div className="flex items-center gap-4 text-white/70 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">👤</span>
                  <span>by {research.first_name} {research.last_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📅</span>
                  <span>{new Date(research.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {research.abstract && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-white/90">Abstract</h3>
                  <p className="text-white/80 leading-relaxed text-lg">{research.abstract}</p>
                </div>
              )}
            </div>
            <div className="text-6xl opacity-60">🔬</div>
          </div>

          {/* Rating and Download */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-2xl">⭐</span>
                  <span className="text-2xl font-bold">{research.average_rating || "0"}</span>
                </div>
                <span className="text-white/60 text-sm">
                  ({research.rating_count || 0} {research.rating_count === 1 ? "rating" : "ratings"})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-lg">💬</span>
                <span className="font-medium">{comments.length}</span>
                <span className="text-white/60 text-sm">
                  {comments.length === 1 ? "comment" : "comments"}
                </span>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105 flex items-center gap-2"
            >
              <span>⬇️</span>
              Download PDF
            </button>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              Rate This Research Paper
            </h2>
            {!user && (
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Login to rate
              </Link>
            )}
          </div>

          {ratingError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {ratingError}
            </div>
          )}

          {user ? (
            <div className="space-y-4">
              <p className="text-white/70">Click on a star to rate this research paper:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleAddRating(star)}
                    className={`text-4xl transition-all hover:scale-110 ${
                      star <= userRating ? "opacity-100" : "opacity-40 hover:opacity-70"
                    }`}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-green-400 text-sm">
                  ✓ You rated this paper {userRating} star{userRating > 1 ? 's' : ''}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🔒</div>
              <p className="text-white/60 mb-4">
                Please sign in to rate and review research papers
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/login"
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-medium text-white hover:opacity-90 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 font-medium text-white hover:bg-white/10 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span className="text-blue-400">💬</span>
              Comments ({comments.length})
            </h2>
            {!user && (
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Login to comment
              </Link>
            )}
          </div>

          {/* Add Comment Form */}
          {user && (
            <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold mb-4">Add a Comment</h3>

              {commentError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                  {commentError}
                </div>
              )}

              <form onSubmit={handleAddComment} className="space-y-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this research paper..."
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  rows={4}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Posting...
                      </div>
                    ) : (
                      "Post Comment"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Guest Notice */}
          {!user && (
            <div className="mb-8 rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💭</span>
                <h3 className="text-lg font-semibold">Join the Academic Discussion</h3>
              </div>
              <p className="text-white/80 mb-4">
                Sign in to share your insights and help advance academic research with comments and ratings.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-medium text-white hover:opacity-90 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 font-medium text-white hover:bg-white/10 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent mb-2"></div>
                <p className="text-white/60 text-sm">Loading comments...</p>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💭</div>
              <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
              <p className="text-white/60">
                Be the first to share your thoughts about this research paper!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                        {comment.first_name[0]}{comment.last_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {comment.first_name} {comment.last_name}
                        </p>
                        <p className="text-xs text-white/50">
                          {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
