"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../lib/LangContext";
import { useTheme } from "../lib/ThemeContext";
import { useSession } from "../lib/useSession";
import { Menu, X, Sun, Moon, User, LogOut, ShieldCheck, Heart, Sparkles } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useQuiz } from "../lib/QuizContext";

export default function Navbar() {
  const { locale, setLocale, t } = useLang();
  const { theme, setTheme } = useTheme();
  const { user, refresh } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { openQuiz } = useQuiz();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAccountOpen(false);
    await refresh();
    router.push("/");
    router.refresh();
  };

  const links = [
    { href: "/#services", label: t.nav.services },
    { href: "/propiedades", label: t.nav.properties },
    { href: "/#about", label: t.nav.about },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <>
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all 0.5s ease",
      background: scrolled ? "rgba(var(--bg),0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(var(--accent),0.12)" : "none",
      padding: scrolled ? "12px 0" : "24px 0",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={34} />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.06em", color: "rgb(var(--ink))" }}>
              El Casa Rosarito
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgb(var(--accent))", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {t.nav.tagline}
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hide-mobile">
          {links.map((l, i) => (
            <a key={i} href={l.href} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(var(--ink),0.55)", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgb(var(--accent))")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(var(--ink),0.55)")}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }} className="hide-mobile">
          <div style={{ display: "flex", border: "1px solid rgba(var(--accent),0.25)", borderRadius: 999, padding: 4, gap: 2 }}>
            {(["en", "es"] as const).map((lang) => (
              <button key={lang} onClick={() => setLocale(lang)}
                style={{ padding: "4px 14px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "all 0.3s",
                  background: locale === lang ? "rgb(var(--accent))" : "transparent",
                  color: locale === lang ? "#FAF6EE" : "rgba(var(--ink),0.4)",
                  fontWeight: locale === lang ? 600 : 400,
                }}>
                {lang}
              </button>
            ))}
          </div>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle dark mode"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, border: "1px solid rgba(var(--accent),0.25)", borderRadius: 999, background: "transparent", cursor: "pointer", color: "rgb(var(--accent))", transition: "all 0.3s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(var(--accent),0.1)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {user ? (
            <div ref={accountRef} style={{ position: "relative" }}>
              <button onClick={() => setAccountOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                aria-label={t.auth.myAccount}>
                <Avatar name={user.name} size={34} />
              </button>
              {accountOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, minWidth: 200, background: "rgb(var(--surface))", border: "1px solid rgba(var(--accent),0.15)", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", zIndex: 60 }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgb(var(--ink))" }}>{user.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.45)" }}>{user.email}</div>
                  </div>
                  <a href="/favoritos" onClick={() => setAccountOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--ink))", textDecoration: "none", borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
                    <Heart size={15} color="rgb(var(--accent))" /> {t.favorites.navLabel}
                  </a>
                  {(user.role !== "client" || user.is_developer) && (
                    <a href="/admin" onClick={() => setAccountOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--ink))", textDecoration: "none", borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
                      <ShieldCheck size={15} color="rgb(var(--accent))" /> {t.auth.adminPanel}
                    </a>
                  )}
                  <button onClick={handleLogout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--ink))" }}>
                    <LogOut size={15} /> {t.auth.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" aria-label={t.auth.login}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, border: "1px solid rgba(var(--accent),0.25)", borderRadius: 999, background: "transparent", cursor: "pointer", color: "rgb(var(--accent))", transition: "all 0.3s", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(var(--accent),0.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
              <User size={15} />
            </a>
          )}

          <button onClick={openQuiz} className="quiz-cta"
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 26px", border: "none", borderRadius: 999, background: "rgb(var(--accent))", cursor: "pointer", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent-light))"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent))"; }}>
            <Sparkles size={14} /> {t.nav.cta}
          </button>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(var(--ink),0.7)", display: "none" }} className="show-mobile">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "rgba(var(--bg),0.98)", borderTop: "1px solid rgba(var(--accent),0.1)", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {links.map((l, i) => (
            <a key={i} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(var(--ink),0.6)", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
          <button onClick={() => { setOpen(false); openQuiz(); }} className="quiz-cta"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "14px 0", border: "none", borderRadius: 999, background: "rgb(var(--accent))", cursor: "pointer", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            <Sparkles size={15} /> {t.nav.cta}
          </button>
          <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(var(--accent),0.1)" }}>
            {(["en", "es"] as const).map((lang) => (
              <button key={lang} onClick={() => setLocale(lang)}
                style={{ padding: "6px 16px", border: `1px solid ${locale === lang ? "rgb(var(--accent))" : "rgba(var(--ink),0.2)"}`, background: "none", color: locale === lang ? "rgb(var(--accent))" : "rgba(var(--ink),0.5)", borderRadius: 999, fontFamily: "'Jost',sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                {lang}
              </button>
            ))}
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle dark mode"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, border: "1px solid rgba(var(--accent),0.2)", borderRadius: 999, background: "none", cursor: "pointer", color: "rgb(var(--accent))" }}>
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>

          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 12, borderTop: "1px solid rgba(var(--accent),0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={user.name} size={30} />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgb(var(--ink))" }}>{user.name}</span>
              </div>
              <a href="/favoritos" onClick={() => setOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--accent))", textDecoration: "none" }}>
                <Heart size={15} /> {t.favorites.navLabel}
              </a>
              {(user.role !== "client" || user.is_developer) && (
                <a href="/admin" onClick={() => setOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--accent))", textDecoration: "none" }}>
                  <ShieldCheck size={15} /> {t.auth.adminPanel}
                </a>
              )}
              <button onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgba(var(--ink),0.6)" }}>
                <LogOut size={15} /> {t.auth.logout}
              </button>
            </div>
          ) : (
            <a href="/login" onClick={() => setOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(var(--accent),0.1)", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--accent))", textDecoration: "none" }}>
              <User size={15} /> {t.auth.login}
            </a>
          )}
        </div>
      )}
    </nav>
    </>
  );
}
