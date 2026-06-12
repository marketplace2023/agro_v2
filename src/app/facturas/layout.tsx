import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function FacturasLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
