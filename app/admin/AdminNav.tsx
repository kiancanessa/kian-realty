"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";

const BASE_TABS = [
  { href: "/admin/reviews", label: "Reseñas" },
  { href: "/admin/announcements", label: "Anuncios" },
  { href: "/admin/news", label: "Noticias" },
  { href: "/admin/contacts", label: "Contactos" },
];

const DEVELOPER_TABS = [
  { href: "/admin/users", label: "Usuarios" },
];

export default function AdminNav({ userName, isDeveloper }: { userName: string; isDeveloper: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = isDeveloper ? [...BASE_TABS, ...DEVELOPER_TABS] : BASE_TABS;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{ borderBottom: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <Link key={tab.href} href={tab.href}
              style={{
                padding: "18px 18px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase",
                textDecoration: "none", borderBottom: pathname.startsWith(tab.href) ? "2px solid rgb(var(--accent))" : "2px solid transparent",
                color: pathname.startsWith(tab.href) ? "rgb(var(--accent))" : "rgba(var(--ink),0.55)",
              }}>
              {tab.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.4)" }}>{userName}</span>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.5)", textDecoration: "none" }}>
            <ExternalLink size={13} /> Ver sitio
          </Link>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.5)" }}>
            <LogOut size={13} /> Salir
          </button>
        </div>
      </div>
    </div>
  );
}
