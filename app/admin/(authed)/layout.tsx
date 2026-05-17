import { requireSession } from "@/lib/auth/guard";
import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="min-h-screen flex">
      <Sidebar role={session.role} />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
        <Topbar user={{ name: session.name, email: session.email, role: session.role }} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
