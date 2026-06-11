import ProtectedLayout from "@/components/dashboard/protected-layout";

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
