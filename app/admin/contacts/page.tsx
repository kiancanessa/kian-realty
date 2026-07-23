import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminContactsClient from "./AdminContactsClient";

export default async function AdminContactsPage() {
  const user = await getSessionUser();
  if (user?.role !== "vendedor" && !user?.is_developer) redirect("/admin/announcements");
  return <AdminContactsClient />;
}
