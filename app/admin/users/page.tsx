import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user?.is_developer) redirect("/admin/announcements");
  return <AdminUsersClient />;
}
