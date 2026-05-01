"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, AUTH_CHANGE_EVENT } from "@/lib/auth";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    const handleAuthChange = () => setUser(getUser());
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0 || segments[0] === "dashboard") return "Dashboard";
    return segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ");
  };

  return (
    <header className="h-20 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-white tracking-tight">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-bold text-white leading-none">
            {user?.first_name && user?.last_name 
              ? `${user.first_name} ${user.last_name}` 
              : user?.first_name || user?.last_name || "Scholar User"}
          </p>
          <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-1">
            Verified Scholar
          </p>
        </div>
        <ProfileAvatar
          src={user?.profile_image}
          name={`${user?.first_name || ''} ${user?.last_name || ''}`}
          size="md"
        />
      </div>
    </header>
  );
}
