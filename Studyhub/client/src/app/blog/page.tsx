"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, AUTH_CHANGE_EVENT } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function BlogPage() {
  const [user, setUser] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", excerpt: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const userData = getUser();
    setUser(userData);

    // Listen to auth changes
    const handleAuthChange = () => {
      setUser(getUser());
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  useEffect(() => {
    // Fetch blog posts from API
    const fetchBlogPosts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const response = await fetch(`${API_URL}/api/blog?limit=50`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          // Transform API data to match expected format
          const apiPosts = data.data.map((post: any) => ({
            id: post.id.toString(),
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: `${post.first_name} ${post.last_name}`,
            date: new Date(post.created_at).toISOString().split("T")[0],
            readTime: `${Math.ceil(post.content.split(" ").length / 200)} min read`,
            image: "📝",
          }));
          setBlogPosts(apiPosts);
        } else {
          // Use sample posts if API returns empty
          setSamplePosts();
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setSamplePosts();
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const setSamplePosts = () => {
    const samplePosts = [
      {
        id: "1",
        title: "How to Build an Effective Study Routine",
        excerpt: "Learn the proven techniques to create a study routine that actually works for your schedule and learning style.",
        content: "Building an effective study routine is crucial for academic success...",
        author: "Ayesha Khan",
        date: "2026-04-01",
        readTime: "3 min read",
        image: "📚",
      },
      {
        id: "2",
        title: "Writing Research Papers That Stand Out",
        excerpt: "Master the art of writing compelling research papers with proper citations, structure, and academic rigor.",
        content: "Writing a research paper requires careful planning and execution...",
        author: "Rafi Ahmed",
        date: "2026-03-28",
        readTime: "5 min read",
        image: "🔬",
      },
      {
        id: "3",
        title: "Ace Your Internship Interviews",
        excerpt: "Tips and strategies to prepare for internship interviews and land your dream position.",
        content: "Internship interviews can be challenging, but with proper preparation...",
        author: "Nihad Hassan",
        date: "2026-03-25",
        readTime: "4 min read",
        image: "💼",
      },
    ];
    setBlogPosts(samplePosts);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setCreateError("Please fill in all required fields");
      return;
    }

    setCreating(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || formData.content.substring(0, 200),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setCreateError(data.message || "Failed to create blog post");
        return;
      }

      // Add new post to the list
      const newPost = {
        id: data.data.id.toString(),
        title: data.data.title,
        excerpt: data.data.excerpt,
        content: data.data.content,
        author: `${user?.first_name} ${user?.last_name}`,
        date: new Date(data.data.created_at).toISOString().split("T")[0],
        readTime: `${Math.ceil(data.data.content.split(" ").length / 200)} min read`,
        image: "📝",
      };

      setBlogPosts([newPost, ...blogPosts]);
      setFormData({ title: "", content: "", excerpt: "" });
      setShowCreateForm(false);
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      setCreateError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-4">StudyHub Blog</h1>
            <p className="text-xl text-white/70">
              Expert guides, study tips, and insights from the community.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white hover:opacity-90 transition-all whitespace-nowrap"
            >
              {showCreateForm ? "Cancel" : "Write Post"}
            </button>
          )}
        </div>

        {/* Create Post Form */}
        {showCreateForm && user && (
          <div className="mb-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8">
            <h2 className="text-2xl font-bold mb-6">Create a New Blog Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-6">
              {createError && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {createError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter blog post title"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your blog post content here..."
                  rows={8}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Excerpt (optional)
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of your post..."
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {creating ? "Publishing..." : "Publish Post"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white hover:border-white/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white/70">Loading blog posts...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">No blog posts yet. Be the first to write one!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:scale-105 h-full flex flex-col">
                  <div className="text-4xl mb-4">{post.image}</div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-purple-300 transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/60 border-t border-white/10 pt-4">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              </Link>
            ))}
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
