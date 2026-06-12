import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function DevolucionesLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
