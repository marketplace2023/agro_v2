import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const role = (session.user as { role?: string }).role ?? "comprador";
  const name = session.user.name ?? session.user.email ?? "Usuario";
  const email = session.user.email ?? "";

  return (
    <div className="flex h-screen bg-[var(--color-background-alt)] overflow-hidden">
      <DashboardSidebar role={role} userName={name} userEmail={email} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
