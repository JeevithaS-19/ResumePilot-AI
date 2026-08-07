"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Menu,
  LogOut,
  User,
} from "lucide-react";

type UserData = {
  id: number;
  name: string;
  email: string;
};

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);

  // ==========================================
  // CHECK LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    const localUser = localStorage.getItem(
      "resumepilot_user"
    );

    const sessionUser = sessionStorage.getItem(
      "resumepilot_user"
    );

    const storedUser = localUser || sessionUser;

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Unable to read user information:",
          error
        );
      }
    }
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    // Remove Remember Me login
    localStorage.removeItem("resumepilot_token");
    localStorage.removeItem("resumepilot_user");

    // Remove normal session login
    sessionStorage.removeItem("resumepilot_token");
    sessionStorage.removeItem("resumepilot_user");

    setUser(null);

    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* ======================================
            LOGO
        ====================================== */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/10
            "
          >
            RP
          </div>

          <div>

            <h1 className="text-xl font-bold text-white">
              ResumePilot AI
            </h1>

            <p className="text-xs text-gray-400">
              Analyze. Improve. Get Hired.
            </p>

          </div>

        </Link>

        {/* ======================================
    DESKTOP MENU
====================================== */}

<div className="hidden items-center gap-8 text-gray-300 md:flex">

  {user ? (
    <>
      <Link
        href="/dashboard"
        className="transition hover:text-white"
      >
        Dashboard
      </Link>

      <Link
        href="/upload"
        className="transition hover:text-white"
      >
        Upload Resume
      </Link>

      <Link
        href="/job-match"
        className="transition hover:text-white"
      >
        Job Match
      </Link>
    </>
  ) : (
    <>
      <Link
        href="/#features"
        className="transition hover:text-white"
      >
        Features
      </Link>

      <Link
        href="/#how-it-works"
        className="transition hover:text-white"
      >
        How It Works
      </Link>
    </>
  )}

</div>

        {/* ======================================
            AUTHENTICATION AREA
        ====================================== */}

        <div className="hidden items-center gap-3 md:flex">

          {user ? (
            <>
              {/* Logged-in user */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900/70
                  px-4
                  py-2
                "
              >

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600/20
                  "
                >
                  <User className="h-4 w-4 text-blue-400" />
                </div>

                <div className="max-w-[130px]">

                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>

                </div>

              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />

                Logout
              </Button>
            </>
          ) : (
            <>
  

             {/* Logged-out user */}
<Button
  variant="outline"
  onClick={() => router.push("/login")}
  className="border-slate-600 bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
>
  Login
</Button>

              <Button
                onClick={() => router.push("/signup")}
                className="
                  bg-blue-600
                  text-white
                  hover:bg-blue-500
                "
              >
                Get Started
              </Button>
            </>
          )}

        </div>

        {/* ======================================
            MOBILE MENU
        ====================================== */}

        <button
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="text-white" />
        </button>

      </div>

    </nav>
  );
}