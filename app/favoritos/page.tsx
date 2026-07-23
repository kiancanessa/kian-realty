"use client";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { useSession } from "../lib/useSession";
import { useFavoritesContext } from "../lib/FavoritesContext";

export default function FavoritesPage() {
  const { t } = useLang();
  const { user, loading: userLoading } = useSession();
  const { favorites, loading, toggle } = useFavoritesContext();

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "140px 24px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Heart size={22} color="rgb(var(--accent))" />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2.2rem", color: "rgb(var(--ink))" }}>
            {t.favorites.title}
          </h1>
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.5)", marginBottom: 40 }}>
          {t.favorites.subtitle}
        </p>

        {!userLoading && !user && (
          <div style={{ textAlign: "center", padding: "60px 24px", border: "1px dashed rgba(var(--accent),0.25)" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.5)", marginBottom: 20 }}>
              {t.favorites.needLogin}
            </p>
            <Link href="/login?next=/favoritos" style={{ display: "inline-block", padding: "12px 28px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {t.auth.login}
            </Link>
          </div>
        )}

        {user && !loading && favorites.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", border: "1px dashed rgba(var(--accent),0.25)" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.5)" }}>
              {t.favorites.empty}
            </p>
          </div>
        )}

        {user && favorites.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {favorites.map(f => (
              <div key={f.property_id} style={{ position: "relative", border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))" }}>
                <button onClick={() => toggle(f.property_id)} aria-label="Remove"
                  style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(10,10,8,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  <X size={14} color="#FAF6EE" />
                </button>
                <Link href={`/propiedades/${f.property_id}`} style={{ textDecoration: "none" }}>
                  <div style={{ height: 160, background: "rgb(var(--bg-alt))" }}>
                    {f.property_image && (
                      <img src={f.property_image} alt={f.property_title ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgb(var(--ink))" }}>
                      {f.property_title ?? f.property_id}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
