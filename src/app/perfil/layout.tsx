import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
