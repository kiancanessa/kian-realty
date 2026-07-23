import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminAnnouncementsClient from "./AdminAnnouncementsClient";

export default async function AdminAnnouncementsPage() {
  const user = await getSessionUser();
  if (user?.role !== "admin" && !user?.is_developer) redirect("/admin/contacts");
  return <AdminAnnouncementsClient />;
}
