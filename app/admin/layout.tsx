import { redirect } from "next/navigation";
import { getSessionUser } from "../lib/auth";
import AdminNav from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin/reviews");
  if (!user.is_admin && !user.is_developer) redirect("/");

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <AdminNav userName={user.name} isDeveloper={user.is_developer} />
      {children}
    </div>
  );
}
