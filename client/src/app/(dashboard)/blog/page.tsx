"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function BlogPage() {
  const [user, setUser] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", excerpt: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setUser(getUser());
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/api/blog?limit=50`);
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setBlogPosts(data.data.map((post: any) => ({
          id: post.id.toString(),
          title: post.title,
          excerpt: post.excerpt,
          author: `${post.first_name} ${post.last_name}`,
          date: new Date(post.created_at).toLocaleDateString(),
          readTime: `${Math.ceil(post.content.split(" ").length / 200)} min read`,
          image: "📝",
        })));
      } else {
        setSamplePosts();
      }
    } catch (error) {
      setSamplePosts();
    } finally {
      setLoading(false);
    }
  };

  const setSamplePosts = () => {
    setBlogPosts([
      { id: "1", title: "Building an Effective Study Routine", excerpt: "Learn proven techniques to create a study routine that actually works.", author: "Ayesha Khan", date: "Apr 1, 2026", readTime: "3 min", image: "📚" },
      { id: "2", title: "Writing Research Papers That Stand Out", excerpt: "Master the art of writing compelling research papers with proper rigor.", author: "Rafi Ahmed", date: "Mar 28, 2026", readTime: "5 min", image: "🔬" },
    ]);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, excerpt: formData.excerpt || formData.content.substring(0, 150) }),
      });
      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ title: "", content: "", excerpt: "" });
        fetchBlogPosts();
      }
    } catch (err) {} finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">StudyHub Blog</h1>
          <p className="text-zinc-400 text-lg">Insights and guides from our academic community.</p>
        </div>
        {user && (
          <Button size="lg" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Cancel Posting" : "Write Article"}
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="p-8 border-sky-500/20 bg-sky-500/[0.02]">
          <h2 className="text-xl font-bold text-white mb-8">Share your knowledge</h2>
          <form onSubmit={handleCreatePost} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Post Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none placeholder:text-zinc-700"
                placeholder="e.g. Tips for Academic Writing"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-sky-500 outline-none"
                rows={8}
                placeholder="Start writing..."
                required
              />
            </div>
            <div className="flex justify-end gap-4 border-t border-zinc-800 pt-8">
               <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>Discard</Button>
               <Button type="submit" isLoading={creating} className="px-12">Publish Article</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-32"><div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card hoverable className="h-full flex flex-col group">
                <div className="text-4xl mb-6">{post.image}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-zinc-500 mb-8 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
