"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { restorePlayer } from "src/lib/player-session";
import { legacyRoute } from "src/lib/legacy-route";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => { void restorePlayer(); }, []);
  useEffect(() => {
    const redirect = () => {
      const route = legacyRoute(window.location.hash);
      if (route) router.replace(route);
    };
    redirect();
    window.addEventListener("hashchange", redirect);
    return () => window.removeEventListener("hashchange", redirect);
  }, [router]);
  return <><Toaster />{children}</>;
}
