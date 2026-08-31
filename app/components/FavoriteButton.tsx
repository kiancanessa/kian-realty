"use client";
import { useState, useRef, useEffect } from "react";
import { Heart, Send } from "lucide-react";
import { useSession } from "../lib/useSession";
import { useFavoritesContext } from "../lib/FavoritesContext";
import { useLang } from "../lib/LangContext";

const LEAD_EMAIL_KEY = "interest_lead_email";

export default function FavoriteButton({
  propertyId, propertyTitle, propertyImage, size = 18, style,
}: {
  propertyId: string; propertyTitle?: string; propertyImage?: string; size?: number; style?: React.CSSProperties;
}) {
  const { t } = useLang();
  const { user } = useSession();
  const { isFavorited, toggle } = useFavoritesContext();
  const favorited = isFavorited(propertyId);

  // Anonymous-visitor path: no account, no redirect — just an email captured
  // once (then remembered) so a heart click becomes a real, identified
  // interest signal instead of a dead end at the login wall.
  const [prompting, setPrompting] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [interested, setInterested] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPrompting(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const recordInterest = async (leadEmail: string) => {
    setSending(true);
    try {
      await fetch("/api/property-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, propertyId, propertyTitle }),
      });
      setInterested(true);
      setPrompting(false);
    } finally {
      setSending(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggle(propertyId, propertyTitle, propertyImage);
      return;
    }
    const savedEmail = window.localStorage.getItem(LEAD_EMAIL_KEY);
    if (savedEmail) {
      recordInterest(savedEmail);
      return;
    }
    setPrompting(true);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = email.trim();
    if (!trimmed) return;
    window.localStorage.setItem(LEAD_EMAIL_KEY, trimmed);
    recordInterest(trimmed);
  };

  const filled = user ? favorited : interested;

  return (
    <div ref={wrapRef} style={{ position: "absolute", ...style }} onClick={e => e.stopPropagation()}>
      <button onClick={handleClick} aria-label="Favorite"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: size + 20, height: size + 20, borderRadius: "50%", border: "none", cursor: "pointer",
          background: "rgba(10,10,8,0.4)", backdropFilter: "blur(6px)",
        }}>
        <Heart size={size} color="#FAF6EE" fill={filled ? "#FAF6EE" : "none"} />
      </button>

      {prompting && (
        <form onSubmit={handlePromptSubmit}
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, width: 220,
            display: "flex", gap: 6, padding: 10, background: "rgb(var(--surface))",
            border: "1px solid rgba(var(--accent),0.18)", boxShadow: "0 12px 28px rgba(0,0,0,0.2)", zIndex: 10,
          }}>
          <input
            type="email" required autoFocus value={email} placeholder={t.interest.emailPlaceholder}
            onChange={e => setEmail(e.target.value)}
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, minWidth: 0, background: "rgb(var(--bg-alt))", border: "1px solid rgba(var(--accent),0.15)",
              outline: "none", padding: "8px 10px", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--ink))",
            }}
          />
          <button type="submit" disabled={sending} aria-label={t.interest.submit}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", width: 34, flexShrink: 0,
              background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: sending ? "not-allowed" : "pointer",
            }}>
            <Send size={14} />
          </button>
        </form>
      )}
    </div>
  );
}
