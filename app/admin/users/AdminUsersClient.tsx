"use client";
import { useEffect, useState } from "react";
import { Code2, ChevronDown } from "lucide-react";
import Avatar from "../../components/Avatar";
import { useSession, type UserRole } from "../../lib/useSession";

type User = { id: number; email: string; name: string; role: UserRole; is_developer: boolean; requested_role: "client" | "team"; created_at: string };

const ROLE_LABEL: Record<UserRole, string> = { client: "Cliente", admin: "Administrador", vendedor: "Vendedor" };

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

  const changeRole = async (id: number, role: UserRole) => {
    setBusyId(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) setUsers(prev => prev.map(u => (u.id === id ? { ...u, role } : u)));
    setBusyId(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))", marginBottom: 8 }}>
          Usuarios
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.5)", marginBottom: 32 }}>
          Asigna el rol de cada cuenta — Administrador publica anuncios y noticias, Vendedor gestiona contactos. Los usuarios con la etiqueta "Pidió acceso de equipo" se registraron solicitando un rol.
        </p>

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {users.map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={u.name} size={38} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "rgb(var(--ink))" }}>{u.name}</span>
                    {u.requested_role === "team" && u.role === "client" && !u.is_developer && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.4)", padding: "2px 7px" }}>
                        Pidió acceso de equipo
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.45)" }}>{u.email}</div>
                </div>
              </div>
              {u.is_developer ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
                  <Code2 size={14} /> Desarrollador
                </span>
              ) : (
                <div style={{ position: "relative" }}>
                  <select
                    value={u.role}
                    disabled={busyId === u.id || u.id === me?.id}
                    onChange={e => changeRole(u.id, e.target.value as UserRole)}
                    title={u.id === me?.id ? "No puedes cambiar tu propio acceso" : undefined}
                    style={{
                      appearance: "none", WebkitAppearance: "none", cursor: u.id === me?.id ? "not-allowed" : "pointer",
                      padding: "8px 34px 8px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase",
                      background: u.role === "client" ? "transparent" : "rgb(var(--accent))",
                      border: `1px solid ${u.role === "client" ? "rgba(var(--accent),0.3)" : "rgb(var(--accent))"}`,
                      color: u.role === "client" ? "rgb(var(--accent))" : "#FAF6EE",
                      opacity: u.id === me?.id ? 0.5 : 1,
                    }}>
                    {(["client", "admin", "vendedor"] as const).map(r => (
                      <option key={r} value={r} style={{ background: "rgb(var(--surface))", color: "rgb(var(--ink))" }}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: u.role === "client" ? "rgb(var(--accent))" : "#FAF6EE" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
