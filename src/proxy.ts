import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PREFIXES = [
  "/buscar", "/categorias", "/productos", "/vendedores",
  "/paises", "/cultivos", "/problemas-agricolas", "/expertos",
  "/biblioteca", "/blog", "/registro", "/login",
  "/recuperar-contrasena", "/como-funciona", "/ser-vendedor",
  "/ser-distribuidor", "/planes", "/ayuda", "/contacto",
  "/legal", "/calculadora", "/api/auth", "/api/search", "/api/products",
];

const PROTECTED_PREFIXES = [
  "/dashboard", "/admin", "/carrito", "/checkout", "/ordenes",
  "/rfq", "/b2b", "/regulatorio", "/perfil", "/notificaciones",
  "/favoritos", "/cotizaciones",
];

const ROLE_DASHBOARD: Record<string, string> = {
  comprador: "/dashboard/comprador",
  comprador_corporativo: "/dashboard/comprador-corporativo",
  vendedor: "/dashboard/vendedor",
  fabricante: "/dashboard/fabricante",
  distribuidor: "/dashboard/distribuidor",
  asesor: "/dashboard/asesor",
  logistica: "/dashboard/logistica",
  regulatorio: "/dashboard/regulatorio",
  finanzas: "/dashboard/finanzas",
  soporte: "/dashboard/soporte",
  marketing: "/dashboard/marketing",
  admin: "/admin",
};

const ROLE_ALLOWED: Record<string, string[]> = {
  "/dashboard/comprador": ["comprador"],
  "/dashboard/comprador-corporativo": ["comprador_corporativo"],
  "/dashboard/vendedor": ["vendedor"],
  "/dashboard/fabricante": ["fabricante"],
  "/dashboard/distribuidor": ["distribuidor"],
  "/dashboard/asesor": ["asesor"],
  "/dashboard/logistica": ["logistica"],
  "/dashboard/regulatorio": ["regulatorio"],
  "/dashboard/finanzas": ["finanzas"],
  "/dashboard/soporte": ["soporte"],
  "/dashboard/marketing": ["marketing"],
};

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) return NextResponse.next();

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token.role as string | undefined) ?? "";

  // Admin-only
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(ROLE_DASHBOARD[role] ?? "/", request.url));
  }

  // Role-specific dashboard routes
  for (const [route, allowed] of Object.entries(ROLE_ALLOWED)) {
    if (pathname.startsWith(route) && !allowed.includes(role) && role !== "admin") {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role] ?? "/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
