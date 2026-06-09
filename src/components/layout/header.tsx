"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Bell,
  Package,
  FileText,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

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

const NAV_LINKS = [
  { label: "Productos", href: "/productos" },
  { label: "Categorías", href: "/categorias" },
  { label: "Vendedores", href: "/vendedores" },
  { label: "Expertos", href: "/expertos" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dashboardHref = session?.user?.role
    ? (ROLE_DASHBOARD[session.user.role] ?? "/")
    : "/login";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="header-sticky">
      <div className="container-max">
        <div className="flex items-center gap-3 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 mr-4"
            aria-label="Marketplace Agro"
          >
            <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">MA</span>
            </div>
            <span
              className="hidden md:block text-white font-bold text-lg leading-tight"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Marketplace
              <br />
              <span className="text-[#7dd2f1] text-sm font-semibold">Agro</span>
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center max-w-2xl"
          >
            <div className="w-full flex">
              <Input
                type="search"
                placeholder="Buscar productos, marcas, categorías…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0 bg-white text-[var(--color-on-surface)] placeholder:text-gray-400 h-10 focus-visible:ring-0"
              />
              <button
                type="submit"
                className="rounded-r-md h-10 px-4 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)] text-white flex items-center transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-1 ml-2">
            {session?.user ? (
              <>
                <Link
                  href="/notificaciones"
                  className="relative p-2 text-white hover:bg-white/10 rounded transition-colors"
                >
                  <Bell className="w-5 h-5" />
                </Link>
                <Link
                  href="/carrito"
                  className="relative p-2 text-white hover:bg-white/10 rounded transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[var(--color-secondary)] text-white border-0 pointer-events-none">
                    0
                  </Badge>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="flex items-center gap-2 text-white hover:bg-white/10 rounded px-2 py-1 transition-colors" />
                    }
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={session.user.image ?? ""}
                        alt={session.user.name ?? ""}
                      />
                      <AvatarFallback className="text-xs bg-[var(--color-primary)] text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {session.user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem render={<Link href={dashboardHref} />}>
                      <LayoutDashboard className="w-4 h-4" /> Mi panel
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/ordenes" />}>
                      <Package className="w-4 h-4" /> Mis pedidos
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/cotizaciones" />}>
                      <FileText className="w-4 h-4" /> Cotizaciones
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/favoritos" />}>
                      <Heart className="w-4 h-4" /> Favoritos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/perfil" />}>
                      <User className="w-4 h-4" /> Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 rounded transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  className="px-3 py-1.5 text-sm font-medium bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)] text-white rounded transition-colors"
                >
                  Registrarme
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button className="md:hidden text-white hover:bg-white/10 p-2 rounded transition-colors" />
              }
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <nav className="flex flex-col h-full">
                <div className="p-4 bg-[var(--color-primary-container)]">
                  <Link
                    href="/"
                    className="text-white font-bold text-xl"
                    onClick={() => setMobileOpen(false)}
                    style={{ fontFamily: "var(--font-headline)" }}
                  >
                    Marketplace Agro
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-3 py-2.5 rounded text-sm font-medium hover:bg-[var(--color-surface-container)] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="p-4 border-t space-y-2">
                  {session?.user ? (
                    <>
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium hover:bg-[var(--color-surface-container)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Mi panel
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        className="w-full text-center px-3 py-2 rounded border border-[var(--color-border-subtle)] text-sm font-medium hover:bg-[var(--color-surface-container)] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        Ingresar
                      </Link>
                      <Link
                        href="/registro"
                        className="w-full text-center px-3 py-2 rounded text-sm font-medium bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)] text-white transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        Registrarme
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop nav bar */}
      <nav className="hidden md:block bg-[var(--color-primary)] border-t border-white/10">
        <div className="container-max">
          <ul className="flex items-center h-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center px-4 h-9 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                href="/paises"
                className="flex items-center gap-1 px-4 h-9 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                🌎 Países
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
