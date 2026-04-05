"use client";
import { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AuthInput({ label, error, className = "", ...props }: AuthInputProps) {
  return (
    <label className="block text-sm text-white">
      <span className="mb-2 block text-sm font-medium text-white/90">{label}</span>
      <input
        className={`w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-400 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </label>
  );
}
