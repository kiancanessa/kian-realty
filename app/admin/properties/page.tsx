import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import { canManageProperties } from "../../lib/ownProperties";
import AdminPropertiesClient from "./AdminPropertiesClient";

export default async function AdminPropertiesPage() {
  const user = await getSessionUser();
  if (!canManageProperties(user)) redirect("/admin/announcements");
  return <AdminPropertiesClient />;
}
