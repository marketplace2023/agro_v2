import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function PagosLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
