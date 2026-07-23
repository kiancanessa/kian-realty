import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminSalesClient from "./AdminSalesClient";

export default async function AdminSalesPage() {
  const user = await getSessionUser();
  if (!user?.is_developer) redirect("/admin/announcements");
  return <AdminSalesClient />;
}
