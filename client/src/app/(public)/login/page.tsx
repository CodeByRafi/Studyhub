"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";
import { API_URL } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [connectionMessage, setConnectionMessage] = useState("");

  // Load remembered email on mount and check for intended route
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRemember(true);
    }

    const intendedRoute = localStorage.getItem("intendedRoute");
    if (intendedRoute === "/connection") {
      setConnectionMessage("Please log in to access Connection features.");
    }
  }, []);

  const isFormValid = useMemo(() => email.trim().length > 0 && password.length >= 6, [email, password]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Please enter a valid email and password (minimum 6 characters).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        data = { message: text || 'Unable to parse server response.' };
      }

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password. Please check your credentials.");
        return;
      }

      // Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Dispatch auth change event for navbar reactivity
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:change', { detail: { user: data.user } }));
      }

      if (remember) {
        localStorage.setItem("rememberEmail", email.trim());
      } else {
        localStorage.removeItem("rememberEmail");
      }

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        const intendedRoute = localStorage.getItem("intendedRoute");
        localStorage.removeItem("intendedRoute");
        router.push(intendedRoute || "/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to your StudyHub account"
        >
          {connectionMessage && (
            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-200 text-sm">
              {connectionMessage}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <AuthInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />

            <div className="space-y-2">
              <AuthInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-white/70">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"} password
                </button>
              </div>
            </div>

            <AuthButton
              type="submit"
              disabled={!isFormValid || loading}
              loading={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </AuthButton>
          </form>

          <div className="text-center">
            <p className="text-sm text-white/70">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
