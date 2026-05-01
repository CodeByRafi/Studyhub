"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { logout, getUser, AUTH_CHANGE_EVENT } from "@/lib/auth";
import { getNetworkingProfileByUserId } from "@/services/networking";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

interface SidebarItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  children?: { name: string; href: string }[];
}

const sidebarItems: SidebarItem[] = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    name: "Study", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    children: [
      { name: "Notes", href: "/study/notes" },
      { name: "Previous Questions", href: "/study/questions" },
    ]
  },
  { 
    name: "Research", 
    href: "/research", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  { 
    name: "Jobs", 
    href: "/jobs", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    name: "Features", 
    href: "/features", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    name: "Blog", 
    href: "/blog", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2v6h6" />
      </svg>
    )
  },
  { 
    name: "Connection", 
    href: "/connection", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    name: "Profile", 
    href: "/profile", 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Study"]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    if (userData) {
      getNetworkingProfileByUserId(userData.id).then(setProfile).catch(() => {});
    }
  }, []);

  useEffect(() => {
    sidebarItems.forEach(item => {
      if (item.children?.some(child => pathname.startsWith(child.href))) {
        if (!expandedGroups.includes(item.name)) setExpandedGroups(prev => [...prev, item.name]);
      }
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setExpandedGroups(prev => 
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
      lg:relative lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      {/* Brand */}
      <div className="h-20 flex items-center px-6 mb-2 border-b border-zinc-900">
        <div className="flex items-center gap-6 w-full">
          {/* Black Circular 'N' Logo */}
          <div className="w-9 h-9 flex-shrink-0 rounded-full bg-black border border-zinc-800 flex items-center justify-center shadow-sm">
            <span className="text-base font-bold text-white tracking-widest">N</span>
          </div>

          {/* StudyHub Brand Block */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all group-hover:bg-sky-400">
              <span className="text-lg font-black text-white italic">S</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight group-hover:text-sky-400 transition-colors">
              StudyHub
            </h2>
          </Link>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden pt-2">
        {sidebarItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedGroups.includes(item.name);
          const isItemActive = item.href ? pathname === item.href : item.children?.some(child => pathname === child.href);

          return (
            <div key={item.name} className="space-y-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    pathname === item.href 
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm shadow-sky-500/5" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <div className={`${pathname === item.href ? "text-sky-400" : "group-hover:text-sky-400"} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                  {pathname === item.href && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isItemActive ? "text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <div className={`${isItemActive || isExpanded ? "text-sky-400" : "group-hover:text-sky-400"} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <svg 
                    className={`ml-auto w-4 h-4 transition-transform duration-200 text-zinc-600 ${isExpanded ? "rotate-90 text-sky-400" : ""}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {hasChildren && isExpanded && (
                <div className="ml-9 space-y-1 border-l border-zinc-800 pl-4 py-1">
                  {item.children!.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={`block px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        pathname === child.href 
                          ? "text-sky-400 bg-sky-500/5" 
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 bg-[#09090b]">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
           <ProfileAvatar
             src={user?.profile_image || profile?.profile_photo_url}
             name={`${user?.first_name || ''} ${user?.last_name || ''}`}
             size="md"
           />
           <div className="flex flex-col overflow-hidden">
             <span className="text-xs font-bold text-white truncate">{user?.first_name} {user?.last_name}</span>
             <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">Scholar</span>
           </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <svg className="w-5 h-5 text-zinc-500 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
