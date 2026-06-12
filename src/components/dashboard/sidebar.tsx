"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, FileText, Package, Users, Leaf,
  Truck, Shield, DollarSign, Headphones, Megaphone, Settings,
  Warehouse, ClipboardList, BarChart2, LogOut, ChevronRight,
  ChevronDown, Store, AlertTriangle, RefreshCw, Star, Tag,
  Receipt, CreditCard, MapPin, Route, Box, FlaskConical,
  Globe, Layers, Bell, Heart, RotateCcw, Search, Building2, User,
} from "lucide-react";
import { signOut } from "next-auth/react";

type NavChild = { label: string; href: string; badge?: string };
type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavChild[];
  badge?: string;
};

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  comprador: [
    { label: "Mi dashboard", href: "/dashboard/comprador", icon: <LayoutDashboard size={16} /> },
    { label: "Mis órdenes", href: "/dashboard/comprador/ordenes", icon: <Package size={16} /> },
    { label: "Mensajes", href: "/mensajes", icon: <Bell size={16} /> },
    { label: "Notificaciones", href: "/notificaciones", icon: <Bell size={16} /> },
    { label: "Mis favoritos", href: "/favoritos", icon: <Heart size={16} /> },
    { label: "Reclamos", href: "/reclamos", icon: <AlertTriangle size={16} /> },
    { label: "Devoluciones", href: "/devoluciones", icon: <RotateCcw size={16} /> },
    { label: "Facturas", href: "/facturas", icon: <Receipt size={16} /> },
    { label: "Pagos", href: "/pagos", icon: <CreditCard size={16} /> },
    { label: "Rastrear envío", href: "/tracking", icon: <Truck size={16} /> },
  ],
  comprador_corporativo: [
    { label: "Mi dashboard", href: "/dashboard/comprador-corporativo", icon: <LayoutDashboard size={16} /> },
    {
      label: "Gestión B2B", icon: <Building2 size={16} />,
      children: [
        { label: "Aprobaciones", href: "/b2b/aprobaciones" },
        { label: "Pedidos recurrentes", href: "/b2b/pedidos-recurrentes" },
        { label: "Contratos", href: "/b2b/contratos" },
        { label: "Catálogo privado", href: "/b2b/catalogo" },
      ],
    },
    { label: "Mis órdenes", href: "/ordenes", icon: <Package size={16} /> },
    { label: "Crédito B2B", href: "/b2b/credito", icon: <DollarSign size={16} /> },
    { label: "Mi empresa", href: "/b2b/cuenta-corporativa", icon: <Users size={16} /> },
  ],
  vendedor: [
    { label: "Mi dashboard", href: "/dashboard/vendedor", icon: <LayoutDashboard size={16} /> },
    {
      label: "Catálogo", icon: <Tag size={16} />,
      children: [
        { label: "Mis productos", href: "/dashboard/vendedor/productos" },
        { label: "Inventario", href: "/dashboard/vendedor/inventario" },
        { label: "Mi tienda", href: "/dashboard/vendedor/tienda" },
      ],
    },
    {
      label: "Ventas", icon: <Package size={16} />,
      children: [
        { label: "Órdenes", href: "/dashboard/vendedor/ordenes" },
        { label: "RFQs recibidas", href: "/dashboard/vendedor/rfq" },
        { label: "Despachos", href: "/dashboard/vendedor/despachos" },
        { label: "Reclamos", href: "/dashboard/vendedor/reclamos" },
      ],
    },
    { label: "Liquidaciones", href: "/dashboard/vendedor/liquidaciones", icon: <DollarSign size={16} /> },
    {
      label: "CRM", icon: <Users size={16} />,
      children: [
        { label: "Dashboard CRM", href: "/dashboard/crm" },
        { label: "Empresas", href: "/crm/empresas" },
        { label: "Contactos", href: "/crm/contactos" },
        { label: "Leads", href: "/crm/leads" },
        { label: "Oportunidades", href: "/crm/oportunidades" },
        { label: "Pipeline", href: "/crm/pipeline" },
        { label: "Actividades", href: "/crm/actividades" },
        { label: "Agenda", href: "/crm/agenda" },
        { label: "Segmentos", href: "/crm/segmentos" },
        { label: "Reportes CRM", href: "/crm/reportes" },
      ],
    },
    { label: "Mensajes", href: "/mensajes", icon: <Bell size={16} />, badge: "3" },
    { label: "Notificaciones", href: "/notificaciones", icon: <Bell size={16} /> },
    {
      label: "Logística", icon: <Truck size={16} />,
      children: [
        { label: "Solicitudes de flete", href: "/logistica/solicitudes" },
        { label: "Flota", href: "/logistica/flota" },
        { label: "Vehículos", href: "/logistica/vehiculos" },
        { label: "Conductores", href: "/logistica/conductores" },
        { label: "Liquidaciones flete", href: "/logistica/liquidaciones" },
        { label: "Incidencias", href: "/logistica/incidencias" },
      ],
    },
    { label: "Analítica", href: "/analitica", icon: <BarChart2 size={16} /> },
  ],
  fabricante: [
    { label: "Mi dashboard", href: "/dashboard/fabricante", icon: <LayoutDashboard size={16} /> },
    {
      label: "Productos", icon: <FlaskConical size={16} />,
      children: [
        { label: "Líneas de producto", href: "/dashboard/fabricante/productos" },
        { label: "Agregar producto", href: "/dashboard/fabricante/productos/nuevo" },
      ],
    },
    { label: "Distribuidores", href: "/dashboard/fabricante/distribuidores", icon: <Users size={16} /> },
    {
      label: "Regulatorio", icon: <Shield size={16} />,
      children: [
        { label: "Registros", href: "/dashboard/fabricante/registros" },
        { label: "Documentos técnicos", href: "/dashboard/fabricante/documentos" },
      ],
    },
  ],
  distribuidor: [
    { label: "Mi dashboard", href: "/dashboard/distribuidor", icon: <LayoutDashboard size={16} /> },
    { label: "Mis ventas", href: "/dashboard/distribuidor/ordenes", icon: <Package size={16} /> },
    { label: "Mi catálogo", href: "/dashboard/distribuidor/productos", icon: <Leaf size={16} /> },
    { label: "Contratos", href: "/dashboard/distribuidor/contratos", icon: <FileText size={16} /> },
    { label: "Clientes", href: "/dashboard/distribuidor/clientes", icon: <Users size={16} /> },
  ],
  asesor: [
    { label: "Mi dashboard", href: "/dashboard/asesor", icon: <LayoutDashboard size={16} /> },
    {
      label: "Casos clínicos", icon: <Leaf size={16} />,
      children: [
        { label: "Diagnósticos", href: "/dashboard/asesor/diagnosticos" },
        { label: "Mis planes", href: "/dashboard/asesor/planes" },
        { label: "Nuevo plan", href: "/dashboard/asesor/planes/nuevo" },
      ],
    },
    { label: "Mis clientes", href: "/dashboard/asesor/clientes", icon: <Users size={16} /> },
  ],
  logistica: [
    { label: "Mi dashboard", href: "/dashboard/logistica", icon: <LayoutDashboard size={16} /> },
    { label: "Solicitudes de flete", href: "/logistica/solicitudes", icon: <ClipboardList size={16} /> },
    {
      label: "Mi flota", icon: <Truck size={16} />,
      children: [
        { label: "Flota y flotas", href: "/logistica/flota" },
        { label: "Vehículos", href: "/logistica/vehiculos" },
        { label: "Conductores", href: "/logistica/conductores" },
      ],
    },
    { label: "Rastrear envío", href: "/tracking", icon: <Route size={16} /> },
    { label: "Incidencias", href: "/logistica/incidencias", icon: <AlertTriangle size={16} /> },
    { label: "Liquidaciones", href: "/logistica/liquidaciones", icon: <DollarSign size={16} /> },
    { label: "Mensajes", href: "/mensajes", icon: <Bell size={16} /> },
  ],
  regulatorio: [
    { label: "Mi dashboard", href: "/dashboard/regulatorio", icon: <LayoutDashboard size={16} /> },
    {
      label: "Documentos", icon: <Shield size={16} />,
      children: [
        { label: "Cola de revisión", href: "/dashboard/regulatorio/documentos" },
        { label: "Alertas", href: "/dashboard/regulatorio/alertas" },
      ],
    },
    { label: "Auditoría", href: "/dashboard/regulatorio/auditoria", icon: <ClipboardList size={16} /> },
  ],
  finanzas: [
    { label: "Mi dashboard", href: "/finanzas/dashboard", icon: <LayoutDashboard size={16} /> },
    {
      label: "Facturación", icon: <Receipt size={16} />,
      children: [
        { label: "Facturas", href: "/finanzas/facturas" },
        { label: "Comisiones", href: "/finanzas/comisiones" },
        { label: "Conciliación", href: "/finanzas/conciliacion" },
      ],
    },
    { label: "Liquidaciones flete", href: "/logistica/liquidaciones", icon: <DollarSign size={16} /> },
    { label: "Pagos", href: "/dashboard/finanzas/pagos", icon: <CreditCard size={16} /> },
    { label: "ERP / Odoo", href: "/configuracion/erp", icon: <RefreshCw size={16} /> },
    { label: "Analítica", href: "/analitica", icon: <BarChart2 size={16} /> },
  ],
  soporte: [
    { label: "Mi dashboard", href: "/dashboard/soporte", icon: <LayoutDashboard size={16} /> },
    { label: "Cola de tickets", href: "/dashboard/soporte/tickets", icon: <Headphones size={16} />, badge: "3" },
    { label: "Reclamos", href: "/dashboard/soporte/reclamos", icon: <AlertTriangle size={16} /> },
    { label: "FAQ / Base de conocimiento", href: "/dashboard/soporte/faq", icon: <FileText size={16} /> },
  ],
  marketing: [
    { label: "Mi dashboard", href: "/dashboard/marketing", icon: <LayoutDashboard size={16} /> },
    { label: "Campañas", href: "/dashboard/marketing/campanas", icon: <Megaphone size={16} /> },
    {
      label: "Blog / Contenido", icon: <FileText size={16} />,
      children: [
        { label: "Artículos", href: "/dashboard/marketing/blog" },
        { label: "Nuevo artículo", href: "/dashboard/marketing/blog/nuevo" },
      ],
    },
    { label: "Métricas", href: "/dashboard/marketing/metricas", icon: <BarChart2 size={16} /> },
    { label: "SEO / Banners", href: "/dashboard/marketing/seo", icon: <Globe size={16} /> },
  ],
  almacen: [
    { label: "Mi dashboard", href: "/dashboard/almacen", icon: <LayoutDashboard size={16} /> },
    { label: "Lotes", href: "/dashboard/almacen/lotes", icon: <Box size={16} /> },
    { label: "Picking", href: "/dashboard/almacen/picking", icon: <ClipboardList size={16} /> },
    { label: "Inventario general", href: "/dashboard/almacen/inventario", icon: <Warehouse size={16} /> },
    { label: "Movimientos", href: "/dashboard/almacen/movimientos", icon: <RefreshCw size={16} /> },
  ],
  representante: [
    { label: "Mi dashboard", href: "/dashboard/representante", icon: <LayoutDashboard size={16} /> },
    { label: "Mis clientes", href: "/dashboard/representante/clientes", icon: <Users size={16} /> },
    { label: "Metas", href: "/dashboard/representante/metas", icon: <Star size={16} /> },
    { label: "Visitas", href: "/dashboard/representante/visitas", icon: <MapPin size={16} /> },
    {
      label: "CRM", icon: <Users size={16} />,
      children: [
        { label: "Leads", href: "/crm/leads" },
        { label: "Oportunidades", href: "/crm/oportunidades" },
        { label: "Pipeline", href: "/crm/pipeline" },
        { label: "Actividades", href: "/crm/actividades" },
        { label: "Agenda", href: "/crm/agenda" },
      ],
    },
    { label: "Mensajes", href: "/mensajes", icon: <Bell size={16} />, badge: "3" },
    { label: "Notificaciones", href: "/notificaciones", icon: <Bell size={16} /> },
  ],
  "experto-regional": [
    { label: "Mi dashboard", href: "/dashboard/experto-regional", icon: <LayoutDashboard size={16} /> },
    { label: "Alertas fitosanitarias", href: "/dashboard/experto-regional/alertas", icon: <AlertTriangle size={16} /> },
    { label: "Capacitaciones", href: "/dashboard/experto-regional/capacitaciones", icon: <Users size={16} /> },
    { label: "Vista de región", href: "/dashboard/experto-regional/region", icon: <Globe size={16} /> },
  ],
  credito: [
    { label: "Mi dashboard", href: "/dashboard/credito", icon: <LayoutDashboard size={16} /> },
    { label: "Solicitudes", href: "/dashboard/credito/solicitudes", icon: <FileText size={16} />, badge: "2" },
    { label: "Historial aprobados", href: "/dashboard/credito/historial", icon: <ClipboardList size={16} /> },
  ],
  admin: [
    { label: "Panel admin", href: "/admin", icon: <LayoutDashboard size={16} /> },
    {
      label: "Gestión", icon: <Settings size={16} />,
      children: [
        { label: "Usuarios", href: "/admin/usuarios" },
        { label: "Productos", href: "/admin/productos" },
        { label: "Configuración", href: "/admin/configuracion" },
      ],
    },
    { label: "Superadmin", href: "/admin/superadmin", icon: <Shield size={16} /> },
    {
      label: "CRM", icon: <Users size={16} />,
      children: [
        { label: "Dashboard CRM", href: "/dashboard/crm" },
        { label: "Empresas", href: "/crm/empresas" },
        { label: "Leads", href: "/crm/leads" },
        { label: "Pipeline", href: "/crm/pipeline" },
        { label: "Reportes", href: "/crm/reportes" },
      ],
    },
    { label: "Mensajes", href: "/mensajes", icon: <Bell size={16} /> },
    {
      label: "Logística", icon: <Truck size={16} />,
      children: [
        { label: "Solicitudes", href: "/logistica/solicitudes" },
        { label: "Incidencias", href: "/logistica/incidencias" },
        { label: "Liquidaciones", href: "/logistica/liquidaciones" },
      ],
    },
    { label: "Finanzas", href: "/finanzas/dashboard", icon: <DollarSign size={16} /> },
    { label: "Regulatorio", href: "/dashboard/regulatorio", icon: <Layers size={16} /> },
    { label: "Analítica", href: "/analitica", icon: <BarChart2 size={16} /> },
    { label: "ERP / Odoo", href: "/configuracion/erp", icon: <RefreshCw size={16} /> },
    { label: "Auditoría", href: "/admin/auditoria", icon: <ClipboardList size={16} /> },
  ],
};

interface SidebarProps {
  role: string;
  userName?: string;
  userEmail?: string;
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const isChildActive = item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + "/"));
  const [open, setOpen] = useState(isChildActive ?? false);

  if (!item.children) {
    const isActive = item.href ? (pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href + "/"))) : false;
    return (
      <Link
        href={item.href ?? "#"}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group ${
          isActive
            ? "bg-[var(--color-primary)] text-white font-medium"
            : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
        }`}
      >
        <span className={isActive ? "text-white" : "text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]"}>{item.icon}</span>
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && <span className="text-[10px] bg-[var(--color-secondary)] text-white px-1.5 py-0.5 rounded-full font-bold leading-none">{item.badge}</span>}
        {isActive && <ChevronRight size={12} className="flex-shrink-0" />}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group ${
          isChildActive
            ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5 font-medium"
            : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
        }`}
      >
        <span className={isChildActive ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]"}>{item.icon}</span>
        <span className="flex-1 text-left truncate">{item.label}</span>
        <span className={`transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}><ChevronRight size={12} /></span>
      </button>
      {open && (
        <div className="ml-4 mt-0.5 pl-3 border-l border-[var(--color-border-subtle)] space-y-0.5">
          {item.children.map(child => {
            const isActive = pathname === child.href || pathname.startsWith(child.href + "/");
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                  isActive
                    ? "text-[var(--color-primary)] font-semibold bg-[var(--color-primary)]/8"
                    : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]"
                }`}
              >
                <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isActive ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-subtle)]"}`} />
                {child.label}
                {child.badge && <span className="ml-auto text-[10px] bg-[var(--color-secondary)] text-white px-1.5 py-0.5 rounded-full font-bold">{child.badge}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardSidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.comprador;

  const roleLabels: Record<string, string> = {
    comprador: "Comprador", comprador_corporativo: "Comprador corporativo",
    vendedor: "Vendedor", fabricante: "Fabricante", distribuidor: "Distribuidor",
    asesor: "Asesor agronómico", logistica: "Logística", regulatorio: "Regulatorio",
    finanzas: "Finanzas", soporte: "Soporte", marketing: "Marketing",
    almacen: "Almacén", representante: "Representante comercial",
    "experto-regional": "Experto regional", credito: "Analista de crédito", admin: "Administrador",
  };

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[var(--color-border-subtle)] flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-[var(--color-border-subtle)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-[var(--color-primary)]">Marketplace Agro</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-3 py-3 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)] flex-shrink-0">
            {userName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--color-on-surface)] truncate">{userName ?? "Usuario"}</p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)] truncate">{roleLabels[role] ?? role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
        {items.map((item, i) => (
          <NavGroup key={i} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-[var(--color-border-subtle)] space-y-0.5">
        <Link href={`/dashboard/${role}/perfil`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors">
          <User size={14} /> Mi perfil
        </Link>
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors">
          <Store size={14} /> Portal público
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--color-secondary)] hover:bg-red-50 transition-colors"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
