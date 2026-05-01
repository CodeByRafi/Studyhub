"use client";

import { useEffect } from "react";
import Link from "next/link";
import { recordVisit } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  useEffect(() => {
    recordVisit("homepage");
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <main className="mx-auto flex flex-col items-center px-4 pt-32 pb-24 sm:px-6 lg:px-8 max-w-7xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          Next Generation University Platform
        </div>

        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl">
          <h1 className="text-6xl font-bold leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            Elevate your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
              academic journey
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            StudyHub provides a centralized ecosystem for notes, research papers, jobs, and peer connections. Built for the modern university experience.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-10 text-lg">Get Started for Free</Button>
            </Link>
            <Link href="/study/notes">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg">Browse Notes</Button>
            </Link>
          </div>
        </section>

        {/* Feature Tags */}
        <div className="mt-20 flex flex-wrap justify-center gap-3 animate-in fade-in duration-1000">
          {[
            { label: 'Study Library', icon: '📚' },
            { label: 'Research Papers', icon: '🔬' },
            { label: 'Job Board', icon: '💼' },
            { label: 'Social Learning', icon: '🤝' },
            { label: 'AI Study Assistant', icon: '🤖' }
          ].map((item) => (
            <div key={item.label} className="px-5 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:border-sky-500/30 hover:text-sky-400 transition-all cursor-default">
              {item.icon} <span className="ml-2">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <section className="mt-32 w-full grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: '12k+', label: 'Active Scholars', color: 'text-sky-400' },
            { number: '50k+', label: 'Study Materials', color: 'text-white' },
            { number: '800+', label: 'Research Projects', color: 'text-white' },
            { number: '200+', label: 'Partnered Recruiters', color: 'text-white' }
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-2">
              <div className={`text-4xl sm:text-5xl font-bold tracking-tight ${stat.color}`}>{stat.number}</div>
              <div className="text-zinc-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Cards Section */}
        <section className="mt-40 w-full">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Comprehensive Modules</h2>
              <p className="text-zinc-500">Everything you need to thrive in a competitive academic environment.</p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                title: 'Academic Library', 
                desc: 'Access verified notes and past exam questions organized by department and course.',
                icon: '📘',
                href: '/study/notes',
                accent: 'bg-sky-500'
              },
              { 
                title: 'Research Hub', 
                desc: 'Discover academic journals, collaborative research, and faculty projects.',
                icon: '🔬',
                href: '/research',
                accent: 'bg-emerald-500'
              },
              { 
                title: 'Career Portal', 
                desc: 'Find internships, part-time tuition jobs, and full-time career opportunities.',
                icon: '💼',
                href: '/jobs',
                accent: 'bg-amber-500'
              }
            ].map((module) => (
              <Link key={module.title} href={module.href}>
                <Card hoverable className="h-full group">
                  <div className={`w-12 h-12 rounded-2xl ${module.accent}/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                    {module.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-sky-400 transition-colors uppercase tracking-tight">{module.title}</h3>
                  <p className="text-zinc-400 leading-relaxed mb-8">
                    {module.desc}
                  </p>
                  <div className="flex items-center gap-2 text-sky-500 font-semibold">
                    Explore Now <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* AI & Innovation Section */}
        <section className="mt-40 w-full bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 sm:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-500/5 blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="inline-flex px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
              Innovation
            </div>
            <h2 className="text-5xl font-bold leading-tight">AI-Powered Study Assistant</h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Summarize long research papers, generate interactive quizzes from your notes, and get instant tutoring on complex topics.
            </p>
            <Link href="/features">
              <Button size="lg">Explore AI Features</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
