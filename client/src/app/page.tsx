"use client";

import { useEffect } from "react";
import Link from "next/link";
import { recordVisit } from "@/services/api";

export default function Home() {
  useEffect(() => {
    recordVisit("homepage");
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero + intro (global Navbar already in layout) */}
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <section className="space-y-8">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
                What do you want to{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  study
                </span>{" "}
                today?
              </h1>
              <p className="max-w-xl text-lg text-white/80 leading-relaxed">
                Access notes, previous year questions, research papers, jobs, and more — all in one place for university students.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Study Notes', href: '/study', icon: '📚' },
                { label: 'Research Papers', href: '/research', icon: '🔬' },
                { label: 'Jobs & Internships', href: '/jobs', icon: '💼' },
                { label: 'CSE Questions', href: '/study', icon: '❓' },
                { label: 'Tuition Jobs', href: '/jobs', icon: '💰' }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-all hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:scale-105"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
              >
                Get Started Free
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/study"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white transition-all hover:border-white/40 hover:bg-white/10"
              >
                Browse Notes
              </Link>
            </div>
          </section>

          <section className="relative">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Explore content categories</h3>
                    <p className="text-sm text-white/70">Dive into structured resources curated for your study goals.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'DBMS Notes', desc: 'Database management systems' },
                    { label: 'CSE Questions', desc: 'Computer science questions' },
                    { label: 'Research Papers', desc: 'Academic research' },
                    { label: 'Internships', desc: 'Job opportunities' },
                    { label: 'Tuition Jobs', desc: 'Teaching positions' }
                  ].map((pill) => (
                    <div key={pill.label} className="group rounded-xl border border-white/20 bg-black/40 p-4 transition-all hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10">
                      <div className="font-medium text-white text-sm">{pill.label}</div>
                      <div className="text-xs text-white/60 mt-1">{pill.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Active users</span>
                    <span className="text-green-400 font-medium">1,200+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-white/70">Study materials</span>
                    <span className="text-blue-400 font-medium">5,000+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
          </section>
        </div>

        {/* Stats section */}
        <section className="mt-24 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '1,200+', label: 'Active Students' },
              { number: '5,000+', label: 'Study Materials' },
              { number: '500+', label: 'Research Papers' },
              { number: '300+', label: 'Job Opportunities' }
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured AI Tools Section */}
        <section className="mt-20 px-2 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Essential AI Tools</h2>
            <p className="text-white/70">Enhance your learning with our powerful AI-powered study assistants.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                title: 'PDF Summarizer', 
                desc: 'Extract key points from PDFs instantly',
                icon: '📄',
                href: '/features/summarizer',
                badge: 'Popular'
              },
              { 
                title: 'Quiz Generator', 
                desc: 'Create interactive quizzes from notes',
                icon: '❓',
                href: '/features/quiz-generator',
                badge: 'New'
              },
              { 
                title: 'Flashcard Maker', 
                desc: 'Generate smart flashcards for review',
                icon: '🎴',
                href: '/features/flashcard-maker',
                badge: 'Trending'
              },
              { 
                title: 'AI Tutor', 
                desc: 'Get instant answers to your questions',
                icon: '🧑‍🎓',
                href: '/features/ai-tutor',
                badge: 'Smart'
              },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href}>
                <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 h-full cursor-pointer">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
                  <div className="relative">
                    <div className="text-4xl mb-4">{tool.icon}</div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold flex-1 group-hover:text-purple-300 transition-colors">{tool.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 whitespace-nowrap ml-2">{tool.badge}</span>
                    </div>
                    <p className="text-sm text-white/70 mb-4">{tool.desc}</p>
                    <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                      Try now <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Blog Posts Section */}
        <section className="mt-20 px-2 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
              <p className="text-white/70">Expert guides and study tips from the community.</p>
            </div>
            <Link href="/blog" className="group flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
              View all <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 'effective-study-routine',
                title: 'How to Build an Effective Study Routine',
                excerpt: 'Learn the proven techniques to create a study routine that actually works.',
                author: 'Ayesha Khan',
                date: '2026-04-01',
                image: '📚',
                readTime: '3 min'
              },
              {
                id: 'research-papers-stand-out',
                title: 'Writing Research Papers That Stand Out',
                excerpt: 'Master the art of writing compelling research papers with proper citations.',
                author: 'Rafi Ahmed',
                date: '2026-03-28',
                image: '🔬',
                readTime: '5 min'
              },
              {
                id: 'exam-preparation-guide',
                title: 'Complete Exam Preparation Guide',
                excerpt: 'A comprehensive guide to prepare for exams using proven study techniques.',
                author: 'Karim Rahman',
                date: '2026-03-20',
                image: '📝',
                readTime: '7 min'
              },
            ].map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:scale-105 h-full flex flex-col">
                  <div className="text-4xl mb-4">{post.image}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/60 border-t border-white/10 pt-4">
                    <span>{post.author}</span>
                    <span>{post.readTime} read</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Research & Jobs Highlight Section */}
        <section className="mt-20 px-2 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Explore More</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Research Papers */}
            <Link href="/research">
              <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 p-8 backdrop-blur-xl transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 h-full cursor-pointer overflow-hidden">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:blur-2xl transition-all"></div>
                <div className="relative">
                  <div className="text-5xl mb-4">🔬</div>
                  <h3 className="text-2xl font-bold mb-3">Research Papers</h3>
                  <p className="text-white/70 mb-6">
                    Access curated research papers, academic journals, and collaborative projects from students and faculty.
                  </p>
                  <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-3 transition-all">
                    Browse papers <span>→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Jobs & Internships */}
            <Link href="/jobs">
              <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-8 backdrop-blur-xl transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 h-full cursor-pointer overflow-hidden">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:blur-2xl transition-all"></div>
                <div className="relative">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="text-2xl font-bold mb-3">Jobs & Internships</h3>
                  <p className="text-white/70 mb-6">
                    Discover internship opportunities, part-time jobs, tuition positions, and career growth resources.
                  </p>
                  <div className="flex items-center gap-2 text-green-400 font-medium group-hover:gap-3 transition-all">
                    Find opportunities <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Live content feed */}
        <section className="mt-20 px-2 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Live Student Feed</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { type: 'Note', title: 'OOP Lecture 5 Notes', subtitle: 'CSE, Dr. Rahman', icon: '📘', badge: 'New' },
              { type: 'Question', title: 'EEE Spring 2025 Final Q&A', subtitle: 'EEE Department', icon: '❓', badge: 'Popular' },
              { type: 'Research', title: 'AI in Biomedical Imaging', subtitle: 'Details on contribution', icon: '🔬', badge: 'Top' },
              { type: 'Job', title: 'Part-time Python Tutor', subtitle: 'BBA Coaching Center', icon: '💼', badge: 'Urgent' },
              { type: 'Note', title: 'Macroeconomics Batch Practice', subtitle: 'Economics Dept.', icon: '📗', badge: 'Study' },
              { type: 'Research', title: 'Data Mining in Social Media', subtitle: 'Collaborative paper', icon: '🧠', badge: 'New' },
            ].map((item) => (
              <article key={`${item.type}-${item.title}`} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <span>{item.icon}</span>
                    <span>{item.type}</span>
                  </div>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-200">{item.badge}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-white/60">{item.subtitle}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                  <span>2h ago</span>
                  <Link href="/study" className="text-purple-400 hover:text-purple-300">View</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
