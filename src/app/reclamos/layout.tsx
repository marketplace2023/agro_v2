import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function ReclamosLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
