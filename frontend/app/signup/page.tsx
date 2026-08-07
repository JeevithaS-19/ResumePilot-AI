"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");

  // Check empty fields
  if (
    !name.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    setError("Please fill in all fields.");
    return;
  }

  // Email validation
  if (!email.includes("@")) {
    setError("Please enter a valid email address.");
    return;
  }

  // Password validation
  if (password.length < 6) {
    setError(
      "Password must contain at least 6 characters."
    );
    return;
  }

  // Confirm password
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
    "https://resumepilot-ai-35p5.onrender.com/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.detail ||
          "Unable to create your account."
      );

      return;
    }

    // Registration successful
    router.push("/login");

  } catch (error) {
    console.error("Signup error:", error);

    setError(
      "Cannot connect to the server. Please make sure the backend is running."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-slate-950
        via-indigo-950/70
        to-slate-950
        "
      />

      {/* Glow Left */}

      <div
        className="
        absolute
        -left-40
        top-20
        h-[450px]
        w-[450px]
        rounded-full
        bg-blue-600/20
        blur-3xl
        "
      />

      {/* Glow Right */}

      <div
        className="
        absolute
        -right-40
        bottom-0
        h-[450px]
        w-[450px]
        rounded-full
        bg-purple-600/20
        blur-3xl
        "
      />

      {/* Main Container */}

      <div
        className="
        relative
        z-10
        flex
        min-h-screen
        items-center
        justify-center
        px-6
        py-14
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="w-full max-w-md"
        >

          {/* Logo */}

          <div className="mb-8 text-center">

            <Link
              href="/"
              className="
              inline-flex
              items-center
              gap-3
              text-2xl
              font-bold
              "
            >

              <div
                className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-indigo-600
                shadow-lg
                shadow-blue-500/20
                "
              >
                <Sparkles className="h-5 w-5" />
              </div>

              <span>
                ResumePilot{" "}
                <span className="text-blue-400">
                  AI
                </span>
              </span>

            </Link>

            <h1
              className="
              mt-7
              text-4xl
              font-bold
              tracking-tight
              "
            >
              Create your account
            </h1>

            <p
              className="
              mt-3
              text-slate-400
              "
            >
              Start building a stronger,
              job-ready resume with AI.
            </p>

          </div>

          {/* Signup Card */}

          <div
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.07]
            p-8
            shadow-2xl
            backdrop-blur-xl
            "
          >

            <form
              onSubmit={handleSignup}
              className="space-y-5"
            >

              {/* Full Name */}

              <div>

                <label
                  className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-300
                  "
                >
                  Full name
                </label>

                <div className="relative">

                  <User
                    className="
                    absolute
                    left-4
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-slate-500
                    "
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    py-3.5
                    pl-12
                    pr-4
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    "
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label
                  className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-300
                  "
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    className="
                    absolute
                    left-4
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-slate-500
                    "
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    py-3.5
                    pl-12
                    pr-4
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    "
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label
                  className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-300
                  "
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    className="
                    absolute
                    left-4
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-slate-500
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Minimum 6 characters"
                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    py-3.5
                    pl-12
                    pr-12
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    transition
                    hover:text-white
                    "
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

              {/* Confirm Password */}

              <div>

                <label
                  className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-300
                  "
                >
                  Confirm password
                </label>

                <div className="relative">

                  <LockKeyhole
                    className="
                    absolute
                    left-4
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-slate-500
                    "
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Re-enter your password"
                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    py-3.5
                    pl-12
                    pr-12
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    transition
                    hover:text-white
                    "
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}

                  </button>

                </div>

              </div>

              {/* Password Requirement */}

              <div
                className="
                flex
                items-center
                gap-2
                text-xs
                text-slate-500
                "
              >

                <CheckCircle2
                  className={
                    password.length >= 6
                      ? "h-4 w-4 text-green-400"
                      : "h-4 w-4"
                  }
                />

                Password must contain at least
                6 characters.

              </div>

              {/* Error Message */}

              {error && (
                <div
                  className="
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-4
                  py-3
                  text-sm
                  text-red-300
                  "
                >
                  {error}
                </div>
              )}

              {/* Signup Button */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                py-3.5
                font-semibold
                shadow-lg
                shadow-blue-600/20
                transition
                hover:from-blue-500
                hover:to-indigo-500
                disabled:cursor-not-allowed
                disabled:opacity-60
                "
              >

                {loading
                  ? "Creating account..."
                  : "Create Account"}

              </motion.button>

            </form>

            {/* Divider */}

            <div
              className="
              my-7
              flex
              items-center
              gap-4
              "
            >

              <div className="h-px flex-1 bg-slate-800" />

              <span
                className="
                text-xs
                uppercase
                tracking-wider
                text-slate-600
                "
              >
                Already registered?
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>

            {/* Login */}

            <Link
              href="/login"
              className="
              block
              w-full
              rounded-xl
              border
              border-slate-700
              py-3.5
              text-center
              font-medium
              text-slate-200
              transition
              hover:border-blue-500/60
              hover:bg-blue-500/10
              "
            >
              Sign in to your account
            </Link>

          </div>

          {/* Footer */}

          <p
            className="
            mt-7
            text-center
            text-sm
            text-slate-600
            "
          >
            ResumePilot AI • AI-powered career intelligence
          </p>

        </motion.div>

      </div>

    </main>
  );
}