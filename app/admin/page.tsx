import { redirect } from "next/navigation";
import { getSessionUser } from "../lib/auth";

export default async function AdminIndexPage() {
  const user = await getSessionUser();
  if (user?.is_developer) redirect("/admin/reviews");
  if (user?.role === "vendedor") redirect("/admin/contacts");
  redirect("/admin/announcements");
}
