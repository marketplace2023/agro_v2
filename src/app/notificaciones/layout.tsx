import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function NotificacionesLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
