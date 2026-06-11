import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function FinanzasLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
