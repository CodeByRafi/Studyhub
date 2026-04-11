"use client";
import { ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function AuthButton({ loading, disabled, children, className = "", ...props }: AuthButtonProps) {
  return (
    <button
      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
