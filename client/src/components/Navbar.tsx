"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getUser, logout, AUTH_CHANGE_EVENT } from "@/lib/auth";
import { Button } from "./ui/Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    const handleAuthChange = () => setUser(getUser());
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  const handleLogout = () => {
    logout();
    setTimeout(() => { window.location.href = "/"; }, 100);
  };

  const navItems = [
    { href: "/study/notes", label: "Study" },
    { href: "/research", label: "Research" },
    { href: "/jobs", label: "Jobs" },
    { href: "/features", label: "Features" },
    { href: "/connection", label: "Connection" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-600/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black italic text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">StudyHub</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-400 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#09090b]">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-base font-medium text-zinc-400 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="block py-3 text-base font-medium text-zinc-400 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4 border-t border-zinc-800 flex flex-col gap-4">
              {user ? (
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
              ) : (
                <>
                  <Link href="/login" className="text-zinc-400">Login</Link>
                  <Link href="/signup"><Button className="w-full">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
