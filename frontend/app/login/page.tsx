"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");

  // Check empty fields
  if (!email.trim() || !password.trim()) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch(
      "https://resumepilot-ai-35p5.onrender.com/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      }
    );

    const data = await response.json();

    // Login failed
    if (!response.ok) {
      setError(
        data.detail || "Invalid email or password."
      );
      return;
    }

    // Save authentication token
    if (rememberMe) {
      localStorage.setItem(
        "resumepilot_token",
        data.access_token
      );

      localStorage.setItem(
        "resumepilot_user",
        JSON.stringify(data.user)
      );
    } else {
      sessionStorage.setItem(
        "resumepilot_token",
        data.access_token
      );

      sessionStorage.setItem(
        "resumepilot_user",
        JSON.stringify(data.user)
      );
    }

    // Login successful
    router.push("/dashboard");

  } catch (error) {
    console.error("Login error:", error);

    setError(
      "Cannot connect to the server. Please make sure the backend is running."
    );
  }
};

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background effects */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/70 to-slate-950" />

      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Branding */}

          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5" />
              </div>

              <span>
                ResumePilot{" "}
                <span className="text-blue-400">AI</span>
              </span>
            </Link>

            <h1 className="mt-8 text-4xl font-bold">
              Welcome back
            </h1>

            <p className="mt-3 text-slate-400">
              Sign in to continue improving your resume.
            </p>
          </div>

          {/* Login card */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-400 transition hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-blue-600"
                />

                Remember me
              </label>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Login */}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
              >
                Sign In
              </motion.button>
            </form>

          </div>

          <p className="mt-7 text-center text-sm text-slate-600">
            ResumePilot AI • AI-powered career intelligence
          </p>
        </motion.div>
      </div>
    </main>
  );
}