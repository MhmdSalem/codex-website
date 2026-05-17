import { redirect } from "next/navigation";
import { getSessionFromCookies, type SessionPayload } from "./session";

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireSuperAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "super_admin") {
    redirect("/admin?error=forbidden");
  }
  return session;
}
