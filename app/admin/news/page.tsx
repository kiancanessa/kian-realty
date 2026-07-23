import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminNewsClient from "./AdminNewsClient";

export default async function AdminNewsPage() {
  const user = await getSessionUser();
  if (user?.role !== "admin" && !user?.is_developer) redirect("/admin/contacts");
  return <AdminNewsClient />;
}
