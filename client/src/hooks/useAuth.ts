// client/src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export function useAuth() {
  const [isAuthenticated, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/session`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled) setAuth(Boolean(data?.authenticated));
      } catch {
        if (!cancelled) setAuth(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { isAuthenticated, isLoading };
}
