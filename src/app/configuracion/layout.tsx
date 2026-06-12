import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function ConfiguracionLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
