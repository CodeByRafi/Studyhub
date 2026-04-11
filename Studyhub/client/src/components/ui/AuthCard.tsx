"use client";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
      </header>
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}
