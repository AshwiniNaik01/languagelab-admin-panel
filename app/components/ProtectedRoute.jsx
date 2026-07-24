"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { initialTopics, initialSubTopics } from "../services/dbService";

// Helper function to read cookie
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
}

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Initialise LocalStorage for Topics & Subtopics if not set yet
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("lab_topics")) {
        localStorage.setItem("lab_topics", JSON.stringify(initialTopics));
      }
      if (!localStorage.getItem("lab_subtopics")) {
        localStorage.setItem("lab_subtopics", JSON.stringify(initialSubTopics));
      }
    }

    // 2. Auth protection check
    const token = getCookie("token");
    const isLoginRoute = pathname === "/admin-login";

    if (!token && !isLoginRoute) {
      setAuthorized(false);
      router.push("/admin-login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized && pathname !== "/admin-login") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2 mb-4"></div>
        <p className="text-sm font-semibold tracking-wide text-slate-400">Authenticating access credentials...</p>
      </div>
    );
  }

  return children;
}
