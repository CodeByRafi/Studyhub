"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const currentUser = getUser();
    setUser(currentUser);
    
    if (!currentUser) {
      router.push("/login");
    }
  }, [router]);

  if (!isClient || !user) {
    return null; // Return nothing while checking auth or redirecting
  }

  const handleLogout = () => {
    logout();
  };

  const sidebarItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/study", label: "Study", icon: "📚" },
    { href: "/research", label: "Research", icon: "🔬" },
    { href: "/jobs", label: "Jobs", icon: "💼" },
    { href: "/features", label: "Features", icon: "⚡" },
    { href: "/blog", label: "Blog", icon: "📝" },
    { href: "/connection", label: "Connection", icon: "🤝" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            StudyHub
          </h2>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3 text-sm font-medium text-white/80 transition-all hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}