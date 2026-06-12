import { auth } from "@/lib/auth/config";
import { NextRequest } from "next/server";

export type Session = NonNullable<Awaited<ReturnType<typeof auth>>>;

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new ApiError("No autenticado", 401);
  }
  return session;
}

export function requireRole(session: Session, allowed: string[]) {
  const role = (session.user as { role?: string }).role ?? "";
  if (!allowed.includes(role)) {
    throw new ApiError("Sin permiso", 403);
  }
}

export function userId(session: Session): string {
  return session.user.id as string;
}

export function userRole(session: Session): string {
  return (session.user as { role?: string }).role ?? "comprador";
}

export class ApiError extends Error {
  constructor(public message: string, public status: number = 400) {
    super(message);
  }
}

export function ok(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function err(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function paginate(req: NextRequest) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function withAuth<T extends unknown[]>(
  handler: (session: Session, ...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      const session = await requireAuth();
      return await handler(session, ...args);
    } catch (e) {
      if (e instanceof ApiError) return err(e.message, e.status);
      console.error(e);
      return err("Error interno del servidor", 500);
    }
  };
}
