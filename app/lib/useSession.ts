"use client";
import { useState, useEffect, useCallback } from "react";

export type SessionUser = { id: number; email: string; name: string; is_admin: boolean; is_developer: boolean };

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh };
}
