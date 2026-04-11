"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

const getPasswordStrength = (password: string) => {
  if (password.length > 11 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    return { text: "Strong", color: "text-green-400" };
  }
  if (password.length >= 8) {
    return { text: "Medium", color: "text-yellow-400" };
  }
  if (password.length > 0) {
    return { text: "Weak", color: "text-red-400" };
  }
  return { text: "", color: "text-white/60" };
};

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const studentIdPattern = /^\d{3}-\d{3}-\d{3}$/;
  const isFormValid = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      studentIdPattern.test(studentId) &&
      department !== "" &&
      password.length >= 6 &&
      passwordsMatch
    );
  }, [fullName, email, studentId, department, password, passwordsMatch]);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!studentIdPattern.test(studentId)) {
      setError("Student ID is required and must match 231-115-095 format.");
      return;
    }

    if (!department) {
      setError("Please select your department.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ") || "";

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          student_id: studentId.trim(),
          department,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Signup failed. Please try again.");
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <AuthCard
          title="Create your account"
          subtitle="Join StudyHub for course notes and community"
        >
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

          <form onSubmit={handleSignup} className="space-y-6">
            <AuthInput
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />

            <AuthInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="231-115-095"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
                <p className="mt-1 text-xs text-white/60">Format: 231-115-095</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-black/20 bg-black px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                >
                  <option value="">Select Department</option>
                  <option>CSE</option>
                  <option>EEE</option>
                  <option>English</option>
                  <option>BBA</option>
                  <option>SU</option>
                  <option>Data Science</option>
                  <option>Economics</option>
                </select>
              </div>

            </div>

            <div className="space-y-4">
              <AuthInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                autoComplete="new-password"
              />

              <AuthInput
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"} passwords
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-white/70">Strength:</span>
                  <span className={`font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text || "—"}
                  </span>
                </div>
              </div>

              {confirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/70">Passwords match:</span>
                  <span className={passwordsMatch ? "text-green-400" : "text-red-400"}>
                    {passwordsMatch ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
              )}
            </div>

            <AuthButton
              type="submit"
              disabled={!isFormValid || loading}
              loading={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              {loading ? "Creating account..." : "Create account"}
            </AuthButton>
          </form>

          <div className="text-center">
            <p className="text-sm text-white/70">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}