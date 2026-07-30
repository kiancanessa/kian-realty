import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminSocialClient from "./AdminSocialClient";

export default async function AdminSocialPage() {
  const user = await getSessionUser();
  if (!user?.is_developer) redirect("/admin/contacts");
  return <AdminSocialClient />;
}
