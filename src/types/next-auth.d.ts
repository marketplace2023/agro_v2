import type { UserRole } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: UserRole;
      companyId: string | null;
      twoFactorEnabled: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    companyId: string | null;
    twoFactorEnabled: boolean;
  }
}
