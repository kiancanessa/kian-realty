import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import AdminReviewsClient from "./AdminReviewsClient";

export default async function AdminReviewsPage() {
  const user = await getSessionUser();
  if (!user?.is_developer) redirect("/admin/announcements");
  return <AdminReviewsClient />;
}
