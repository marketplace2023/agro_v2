"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

const PRIVATE_PREFIXES = ["/dashboard", "/admin", "/perfil"];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivate = PRIVATE_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isPrivate) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
