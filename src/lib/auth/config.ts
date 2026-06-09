import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { UserRole } from "@/generated/prisma";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login?verify=1",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      issuer: process.env.MICROSOFT_TENANT_ID
        ? `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/v2.0`
        : "https://login.microsoftonline.com/common/v2.0",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });

        if (!user || !user.passwordHash) return null;
        if (user.suspended) throw new Error("suspended");
        if (!user.verified) throw new Error("unverified");

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        const fullName = user.profile
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : null;

        return {
          id: user.id,
          email: user.email,
          name: fullName,
          image: user.profile?.avatarUrl ?? null,
          role: user.role as UserRole,
          companyId: user.companyId,
          twoFactorEnabled: user.twoFactorEnabled,
        } as never;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: UserRole }).role;
        token.companyId = (
          user as unknown as { companyId: string | null }
        ).companyId;
        token.twoFactorEnabled = (
          user as unknown as { twoFactorEnabled: boolean }
        ).twoFactorEnabled;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.companyId = token.companyId as string | null;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
      }
      return session;
    },
  },
});
