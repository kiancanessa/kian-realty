"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import type { UserRole } from "../lib/useSession";

const ADMIN_TABS = [
  { href: "/admin/announcements", label: "Anuncios" },
  { href: "/admin/news", label: "Noticias" },
];

const VENDEDOR_TABS = [
  { href: "/admin/contacts", label: "Contactos" },
];

const DEVELOPER_TABS = [
  { href: "/admin/reviews", label: "Reseñas" },
  { href: "/admin/announcements", label: "Anuncios" },
  { href: "/admin/news", label: "Noticias" },
  { href: "/admin/contacts", label: "Contactos" },
  { href: "/admin/projects", label: "Proyectos" },
  { href: "/admin/sales", label: "Ventas" },
  { href: "/admin/certifications", label: "Certificaciones" },
  { href: "/admin/users", label: "Usuarios" },
];

export default function AdminNav({ userName, role, isDeveloper }: { userName: string; role: UserRole; isDeveloper: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = isDeveloper ? DEVELOPER_TABS : role === "vendedor" ? VENDEDOR_TABS : ADMIN_TABS;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{ borderBottom: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <Link key={tab.href} href={tab.href}
              style={{
                padding: "18px 14px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.74rem", letterSpacing: "0.06em", textTransform: "uppercase",
                textDecoration: "none", borderBottom: pathname.startsWith(tab.href) ? "2px solid rgb(var(--accent))" : "2px solid transparent",
                color: pathname.startsWith(tab.href) ? "rgb(var(--accent))" : "rgba(var(--ink),0.55)", whiteSpace: "nowrap",
              }}>
              {tab.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
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
