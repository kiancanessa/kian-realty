import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminProjectsClient from "./AdminProjectsClient";

export default async function AdminProjectsPage() {
  const user = await getSessionUser();
  if (!user?.is_developer) redirect("/admin/announcements");
  return <AdminProjectsClient />;
}
