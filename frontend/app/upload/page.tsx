"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ResumeUpload from "@/components/resume/ResumeUpload";

export default function UploadPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check both storage locations because:
    // Remember Me = localStorage
    // Normal login = sessionStorage

    const localToken = localStorage.getItem(
      "resumepilot_token"
    );

    const sessionToken = sessionStorage.getItem(
      "resumepilot_token"
    );

    const token = localToken || sessionToken;

    // User is not logged in
    if (!token) {
      setIsAuthenticated(false);
      setCheckingAuth(false);

      router.replace("/login");

      return;
    }

    // User has authentication token
    setIsAuthenticated(true);
    setCheckingAuth(false);
  }, [router]);

  // ==========================================
  // CHECKING AUTHENTICATION
  // ==========================================

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">

          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-slate-700
              border-t-blue-500
            "
          />

          <p className="mt-5 text-slate-400">
            Checking authentication...
          </p>

        </div>
      </main>
    );
  }

  // ==========================================
  // NOT AUTHENTICATED
  // ==========================================

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950" />
    );
  }

  // ==========================================
  // AUTHENTICATED
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <ResumeUpload />
    </main>
  );
}