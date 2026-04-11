"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, getToken } from "@/lib/auth";
import { recordVisit, getUserStats } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    recordVisit("dashboard");

    const fetchStats = async () => {
      try {
        const token = getToken();
        if (token) {
          const statsData = await getUserStats(token);
          setStats(statsData);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium animate-pulse">Syncing your workspace...</p>
      </div>
    );
  }

  const statCards = [
    { title: "Notes Shared", value: stats?.totalNotesUploaded || 0, icon: "📚", color: "text-sky-400" },
    { title: "Questions", value: stats?.totalQuestionsUploaded || 0, icon: "❓", color: "text-sky-400" },
    { title: "Research", value: stats?.totalResearchUploaded || 0, icon: "🔬", color: "text-sky-400" },
    { title: "Impact", value: stats?.ratingsReceived || 0, icon: "✨", color: "text-sky-400" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Hi, {user?.first_name || "Scholar"}!
          </h1>
          <p className="text-zinc-400 text-lg">
            Monitor your academic performance and contributions from one place.
          </p>
        </div>
        <Link href="/study/notes">
          <Button size="lg">Upload New Material</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden group">
            <div className={`text-4xl mb-4 group-hover:scale-110 transition-transform duration-300`}>{card.icon}</div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white tracking-tight">{card.value}</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{card.title}</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3l-1.5 1.5L14.7 9H3v2h11.7l-3.2 3.5L13 16l6-6-6-6z"/></svg>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Navigation Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
             <span className="w-1.5 h-6 bg-sky-500 rounded-full"></span>
             Quick Navigation
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Study Library', desc: 'Browse notes and questions', icon: '📚', href: '/study/notes' },
              { title: 'Research Hub', desc: 'Latest academic findings', icon: '🔬', href: '/research' },
              { title: 'Jobs & Tutors', desc: 'Career opportunities', icon: '💼', href: '/jobs' },
              { title: 'Connections', desc: 'Find study partners', icon: '🤝', href: '/connection' }
            ].map((link) => (
              <Link key={link.title} href={link.href}>
                <Card hoverable className="p-5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl group-hover:bg-sky-500/10 transition-colors">
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-sky-400 transition-colors">{link.title}</h3>
                    <p className="text-xs text-zinc-500">{link.desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
             <span className="w-1.5 h-6 bg-zinc-700 rounded-full"></span>
             Recent Feed
          </h2>
          <Card className="divide-y divide-zinc-800 p-0">
            {[
              { title: 'Chemistry Notes added', time: '2h ago', icon: '✨' },
              { title: 'Profile verified', time: '5h ago', icon: '🛡️' },
              { title: 'Connected with Rafi', time: 'Yesterday', icon: '👥' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-sm">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-zinc-200">{item.title}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.time}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}