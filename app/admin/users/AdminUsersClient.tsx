"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, Shield, Code2 } from "lucide-react";
import Avatar from "../../components/Avatar";
import { useSession } from "../../lib/useSession";

type User = { id: number; email: string; name: string; is_admin: boolean; is_developer: boolean; created_at: string };

export default function AdminUsersClient() {
  const { user: me } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  const toggleAdmin = async (id: number, current: boolean) => {
    setBusyId(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_admin: !current }),
    });
    if (res.ok) setUsers(prev => prev.map(u => (u.id === id ? { ...u, is_admin: !current } : u)));
    setBusyId(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))", marginBottom: 8 }}>
          Usuarios
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.5)", marginBottom: 32 }}>
          Designa quién puede moderar reseñas y publicar anuncios.
        </p>

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {users.map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={u.name} size={38} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "rgb(var(--ink))" }}>{u.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.45)" }}>{u.email}</div>
                </div>
              </div>
              {u.is_developer ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
                  <Code2 size={14} /> Desarrollador
                </span>
              ) : (
                <button
                  disabled={busyId === u.id || u.id === me?.id}
                  onClick={() => toggleAdmin(u.id, u.is_admin)}
                  title={u.id === me?.id ? "No puedes cambiar tu propio acceso" : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", cursor: u.id === me?.id ? "not-allowed" : "pointer",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase",
                    background: u.is_admin ? "rgb(var(--accent))" : "transparent",
                    border: `1px solid ${u.is_admin ? "rgb(var(--accent))" : "rgba(var(--accent),0.3)"}`,
                    color: u.is_admin ? "#FAF6EE" : "rgb(var(--accent))",
                    opacity: u.id === me?.id ? 0.5 : 1,
                  }}>
                  {u.is_admin ? <ShieldCheck size={14} /> : <Shield size={14} />}
                  {u.is_admin ? "Administrador" : "Hacer administrador"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
