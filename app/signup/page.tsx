"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "../lib/LangContext";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const { locale, setLocale, t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [requestedRole, setRequestedRole] = useState<"client" | "team">("client");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, requestedRole }),
    });
    setLoading(false);
    if (res.ok) {
      const { user } = await res.json();
      const explicitNext = searchParams.get("next");
      const next = explicitNext || (user.role !== "client" || user.is_developer ? "/admin" : "/");
      router.push(next);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error === "email_taken" ? t.auth.errorEmailTaken : t.auth.errorInvalid);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(var(--bg-alt),1)", border: "1px solid rgba(var(--accent),0.2)",
    outline: "none", padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.9rem",
    color: "rgb(var(--ink))", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "rgb(var(--bg))", padding: 20 }}>
      <form onSubmit={handleSubmit} style={{ width: "min(380px, 100%)", padding: 36, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--surface))", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
            El Casa Rosarito
          </Link>
          <div style={{ display: "flex", border: "1px solid rgba(var(--accent),0.25)", borderRadius: 999, padding: 3, gap: 2 }}>
            {(["en", "es"] as const).map(lang => (
              <button key={lang} type="button" onClick={() => setLocale(lang)}
                style={{ padding: "3px 11px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.3s",
                  background: locale === lang ? "rgb(var(--accent))" : "transparent",
                  color: locale === lang ? "#FAF6EE" : "rgba(var(--ink),0.5)",
                  fontWeight: locale === lang ? 600 : 400,
                }}>
                {lang}
              </button>
            ))}
          </div>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.9rem", color: "rgb(var(--ink))" }}>
          {t.auth.signupTitle}
        </h1>

        <div style={{ display: "flex", border: "1px solid rgba(var(--accent),0.2)", padding: 3, gap: 2 }}>
          {(["client", "team"] as const).map(role => (
            <button key={role} type="button" onClick={() => setRequestedRole(role)}
              style={{ flex: 1, padding: "9px 0", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.25s",
                background: requestedRole === role ? "rgb(var(--accent))" : "transparent",
                color: requestedRole === role ? "#FAF6EE" : "rgba(var(--ink),0.55)",
              }}>
              {role === "client" ? t.auth.accountTypeClient : t.auth.accountTypeTeam}
            </button>
          ))}
        </div>
        {requestedRole === "team" && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.5)", lineHeight: 1.5, marginTop: -8 }}>
            {t.auth.accountTypeNote}
          </p>
        )}

        <input type="text" placeholder={t.auth.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
        <input type="email" placeholder={t.auth.email} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
        <input type="password" placeholder={t.auth.password} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} style={inputStyle} />
        {error && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgb(var(--error))" }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ padding: "12px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {loading ? t.auth.loading : t.auth.submitSignup}
        </button>
        <Link href="/login" style={{ textAlign: "center", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--accent))" }}>
          {t.auth.switchToLogin}
        </Link>
      </form>
    </div>
  );
}
