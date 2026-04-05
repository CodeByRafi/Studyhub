"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getUser, logout, getToken } from "@/lib/auth";
import { recordVisit, getUserStats } from "@/services/api";

export default function DashboardPage() {
  return <DashboardContent />;
}

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = getUser();
    setUser(userData);

    // Record page visit
    recordVisit("dashboard");

    const fetchStats = async () => {
      setError("");
      try {
        const token = getToken();
        if (!token) {
          setError("Please log in to view your personal dashboard.");
          setLoading(false);
          return;
        }
        const statsData = await getUserStats(token);
        setStats(statsData);
      } catch (err: any) {
        setError("Failed to load your statistics. Please refresh the page.");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "My Notes Uploaded",
      value: stats?.totalNotesUploaded || 0,
      icon: "📝",
      description: "Study notes you've shared",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "My Questions Uploaded",
      value: stats?.totalQuestionsUploaded || 0,
      icon: "❓",
      description: "Previous year questions shared",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "My Research Papers",
      value: stats?.totalResearchUploaded || 0,
      icon: "📄",
      description: "Research papers you've shared",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Ratings Received",
      value: stats?.ratingsReceived || 0,
      icon: "⭐",
      description: "Total ratings on your content",
      color: "from-yellow-500 to-yellow-600"
    },
  ];

  const sidebarItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊", active: true },
    { href: "/study", label: "Study", icon: "📚" },
    { href: "/research", label: "Research", icon: "🔬" },
    { href: "/jobs", label: "Jobs", icon: "💼" },
    { href: "/features", label: "Features", icon: "⚡" },
    { href: "/blog", label: "Blog", icon: "📝" },
    { href: "/connection", label: "Connection", icon: "🤝" },
  ];

  const quickActions = [
    {
      title: "Browse Study Notes",
      description: "Find notes for your courses",
      href: "/study",
      icon: "📚",
      color: "bg-blue-500/20 border-blue-500/30"
    },
    {
      title: "Upload Research Paper",
      description: "Share your academic work",
      href: "/research",
      icon: "🔬",
      color: "bg-green-500/20 border-green-500/30"
    },
    {
      title: "Find Job Opportunities",
      description: "Explore internships and jobs",
      href: "/jobs",
      icon: "💼",
      color: "bg-purple-500/20 border-purple-500/30"
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.first_name || "Student"}! 👋
        </h1>
        <p className="text-white/70 text-lg">
          Here's what's happening in your study community
        </p>
      </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
                <p className="text-white/70 text-sm font-medium">{card.title}</p>
                <p className="text-white/50 text-xs">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`group block rounded-xl border p-6 transition-all hover:scale-105 ${action.color}`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-3xl">{action.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-white/90">
                      {action.title}
                    </h3>
                    <p className="text-sm text-white/70">{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center text-purple-400 group-hover:text-purple-300">
                  <span className="text-sm font-medium">Get started</span>
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-sm font-bold">📚</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New study materials uploaded</p>
                <p className="text-xs text-white/60">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <span className="text-sm font-bold">🔬</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Research paper shared</p>
                <p className="text-xs text-white/60">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold">💼</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New job opportunity posted</p>
                <p className="text-xs text-white/60">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}