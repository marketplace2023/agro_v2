import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");

  const role = (session.user as { role?: string }).role ?? "";
  if (role !== "admin") redirect("/login");

  const name = session.user.name ?? session.user.email ?? "Admin";

  return (
    <div className="flex h-screen bg-[var(--color-background-alt)] overflow-hidden">
      <DashboardSidebar role="admin" userName={name} userEmail={session.user.email ?? ""} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
