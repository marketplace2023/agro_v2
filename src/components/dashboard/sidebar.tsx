"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, FileText, Package, Users, Leaf,
  Truck, Shield, DollarSign, Headphones, Megaphone, Settings,
  Warehouse, ClipboardList, BarChart2, LogOut, ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  comprador: [
    { label: "Mi dashboard", href: "/dashboard/comprador", icon: <LayoutDashboard size={16} /> },
    { label: "Mis órdenes", href: "/ordenes", icon: <Package size={16} /> },
    { label: "Cotizaciones", href: "/rfq", icon: <FileText size={16} /> },
    { label: "Carrito", href: "/carrito", icon: <ShoppingCart size={16} /> },
    { label: "Favoritos", href: "/favoritos", icon: <Leaf size={16} /> },
    { label: "Mi perfil", href: "/perfil", icon: <Users size={16} /> },
  ],
  comprador_corporativo: [
    { label: "Mi dashboard", href: "/dashboard/comprador-corporativo", icon: <LayoutDashboard size={16} /> },
    { label: "Aprobaciones", href: "/b2b/aprobaciones", icon: <ClipboardList size={16} /> },
    { label: "Órdenes", href: "/ordenes", icon: <Package size={16} /> },
    { label: "Contratos", href: "/b2b/contratos", icon: <FileText size={16} /> },
    { label: "Crédito", href: "/b2b/credito", icon: <DollarSign size={16} /> },
    { label: "Mi empresa", href: "/b2b/cuenta-corporativa", icon: <Users size={16} /> },
  ],
  vendedor: [
    { label: "Mi dashboard", href: "/dashboard/vendedor", icon: <LayoutDashboard size={16} /> },
    { label: "Mis ventas", href: "/ordenes", icon: <Package size={16} /> },
    { label: "RFQs recibidas", href: "/rfq", icon: <FileText size={16} /> },
    { label: "Mis productos", href: "/productos", icon: <Leaf size={16} /> },
    { label: "Mi tienda", href: "/perfil", icon: <Users size={16} /> },
  ],
  fabricante: [
    { label: "Mi dashboard", href: "/dashboard/fabricante", icon: <LayoutDashboard size={16} /> },
    { label: "Mis líneas", href: "/productos", icon: <Leaf size={16} /> },
    { label: "Distribuidores", href: "/b2b/empresas", icon: <Users size={16} /> },
    { label: "Regulatorio", href: "/regulatorio", icon: <Shield size={16} /> },
    { label: "Órdenes", href: "/ordenes", icon: <Package size={16} /> },
  ],
  distribuidor: [
    { label: "Mi dashboard", href: "/dashboard/distribuidor", icon: <LayoutDashboard size={16} /> },
    { label: "Mis ventas", href: "/ordenes", icon: <Package size={16} /> },
    { label: "Mis productos", href: "/productos", icon: <Leaf size={16} /> },
    { label: "Contratos", href: "/b2b/contratos", icon: <FileText size={16} /> },
    { label: "Clientes", href: "/b2b/empresas", icon: <Users size={16} /> },
  ],
  asesor: [
    { label: "Mi dashboard", href: "/dashboard/asesor", icon: <LayoutDashboard size={16} /> },
    { label: "Diagnósticos", href: "/asesoria-agronomica", icon: <Leaf size={16} /> },
    { label: "Mis planes", href: "/perfil", icon: <ClipboardList size={16} /> },
  ],
  logistica: [
    { label: "Mi dashboard", href: "/dashboard/logistica", icon: <LayoutDashboard size={16} /> },
    { label: "Despachos", href: "/ordenes", icon: <Truck size={16} /> },
    { label: "Incidencias", href: "/perfil", icon: <ClipboardList size={16} /> },
  ],
  regulatorio: [
    { label: "Mi dashboard", href: "/dashboard/regulatorio", icon: <LayoutDashboard size={16} /> },
    { label: "Cola de revisión", href: "/regulatorio", icon: <Shield size={16} /> },
    { label: "Documentos", href: "/biblioteca", icon: <FileText size={16} /> },
    { label: "Auditoría", href: "/admin/auditoria", icon: <ClipboardList size={16} /> },
  ],
  finanzas: [
    { label: "Mi dashboard", href: "/dashboard/finanzas", icon: <LayoutDashboard size={16} /> },
    { label: "Pagos", href: "/ordenes", icon: <DollarSign size={16} /> },
    { label: "Liquidaciones", href: "/perfil", icon: <BarChart2 size={16} /> },
    { label: "Crédito B2B", href: "/b2b/credito", icon: <FileText size={16} /> },
  ],
  soporte: [
    { label: "Mi dashboard", href: "/dashboard/soporte", icon: <LayoutDashboard size={16} /> },
    { label: "Cola de tickets", href: "/perfil", icon: <Headphones size={16} /> },
    { label: "Órdenes", href: "/ordenes", icon: <Package size={16} /> },
  ],
  marketing: [
    { label: "Mi dashboard", href: "/dashboard/marketing", icon: <LayoutDashboard size={16} /> },
    { label: "Campañas", href: "/perfil", icon: <Megaphone size={16} /> },
    { label: "Blog", href: "/blog", icon: <FileText size={16} /> },
    { label: "Métricas", href: "/perfil", icon: <BarChart2 size={16} /> },
  ],
  almacen: [
    { label: "Mi dashboard", href: "/dashboard/almacen", icon: <LayoutDashboard size={16} /> },
    { label: "Inventario", href: "/perfil", icon: <Warehouse size={16} /> },
    { label: "Lotes", href: "/perfil", icon: <Package size={16} /> },
    { label: "Picking/Packing", href: "/ordenes", icon: <ClipboardList size={16} /> },
  ],
  admin: [
    { label: "Panel admin", href: "/admin", icon: <LayoutDashboard size={16} /> },
    { label: "Usuarios", href: "/admin/usuarios", icon: <Users size={16} /> },
    { label: "Configuración", href: "/admin/configuracion", icon: <Settings size={16} /> },
    { label: "Auditoría", href: "/admin/auditoria", icon: <ClipboardList size={16} /> },
    { label: "Regulatorio", href: "/regulatorio", icon: <Shield size={16} /> },
    { label: "Finanzas", href: "/dashboard/finanzas", icon: <DollarSign size={16} /> },
  ],
};

interface SidebarProps {
  role: string;
  userName?: string;
  userEmail?: string;
}

export function DashboardSidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.comprador;

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[var(--color-border-subtle)] flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-[var(--color-border-subtle)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-[var(--color-primary)] font-[var(--font-headline)]">Marketplace Agro</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
            {userName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--color-on-surface)] truncate">{userName ?? "Usuario"}</p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)] truncate capitalize">{role.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group ${
                isActive
                  ? "bg-[var(--color-primary)] text-white font-medium"
                  : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              <span className={isActive ? "text-white" : "text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-[var(--color-border-subtle)] space-y-1">
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]">
          <Leaf size={16} /> Portal público
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-secondary)] hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
