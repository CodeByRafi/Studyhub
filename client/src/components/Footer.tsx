"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    setUser(getUser());
  }, []);

  const quickLinks = [
    { label: "Study", href: "/study" },
    { label: "Research", href: "/research" },
    { label: "Jobs", href: "/jobs" },
    { label: "Features", href: "/features" },
    { label: "Blog", href: "/blog" },
    { label: "Connection", href: "/connection" },
  ];

  const resources = [
    { label: "Notes", href: "/study" },
    { label: "Previous Year Questions", href: "/study" },
    { label: "Research Papers", href: "/research" },
    { label: "Internships", href: "/jobs" },
    { label: "Tuition Jobs", href: "/jobs" },
  ];

  const accountLinks = (isClient && user)
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile", href: "/dashboard" },
        { label: "Settings", href: "/dashboard" },
      ]
    : [
        { label: "Login", href: "/login" },
        { label: "Sign Up", href: "/signup" },
      ];

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              StudyHub
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              A modern platform for students to access notes, questions, research, jobs, and smart academic tools.
            </p>
            <div className="flex gap-4">
              {[
                { icon: "f", label: "Facebook" },
                { icon: "𝕏", label: "Twitter" },
                { icon: "in", label: "LinkedIn" },
              ].map((social, idx) => (
                <a
                  key={`social-${idx}`}
                  href="#"
                  className="h-10 w-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-sm font-semibold text-white hover:border-purple-400 hover:bg-purple-500/20 transition-all"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={`quicklink-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link, idx) => (
                <li key={`resource-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Account</h3>
            <ul className="space-y-2">
              {accountLinks.map((link, idx) => (
                <li key={`account-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© 2026 StudyHub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
