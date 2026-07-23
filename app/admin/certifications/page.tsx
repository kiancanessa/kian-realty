import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminCertificationsClient from "./AdminCertificationsClient";

export default async function AdminCertificationsPage() {
  const user = await getSessionUser();
  if (!user?.is_developer) redirect("/admin/announcements");
  return <AdminCertificationsClient />;
}
