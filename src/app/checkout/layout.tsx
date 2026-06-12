import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
