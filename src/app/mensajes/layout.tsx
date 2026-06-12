import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function MensajesLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
