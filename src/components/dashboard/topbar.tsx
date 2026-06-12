"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  comprador: "Comprador", "comprador-corporativo": "Corporativo",
  vendedor: "Vendedor", fabricante: "Fabricante", distribuidor: "Distribuidor",
  asesor: "Asesor agronómico", logistica: "Logística", regulatorio: "Regulatorio",
  finanzas: "Finanzas", soporte: "Soporte", marketing: "Marketing",
  almacen: "Almacén", representante: "Representante", credito: "Crédito",
  "experto-regional": "Experto regional", admin: "Admin",
  // sections
  productos: "Productos", ordenes: "Órdenes", inventario: "Inventario",
  tienda: "Mi tienda", rfq: "RFQs", despachos: "Despachos",
  liquidaciones: "Liquidaciones", reclamos: "Reclamos", distribuidores: "Distribuidores",
  registros: "Registros", documentos: "Documentos", diagnosticos: "Diagnósticos",
  planes: "Planes", clientes: "Clientes", rutas: "Rutas",
  "prueba-entrega": "Prueba de entrega", incidencias: "Incidencias",
  conciliacion: "Conciliación", pagos: "Pagos", tickets: "Tickets",
  faq: "FAQ", campanas: "Campañas", blog: "Blog", metricas: "Métricas",
  seo: "SEO", lotes: "Lotes", picking: "Picking", movimientos: "Movimientos",
  alertas: "Alertas", auditoria: "Auditoría", metas: "Metas", visitas: "Visitas",
  capacitaciones: "Capacitaciones", region: "Región", solicitudes: "Solicitudes de flete",
  historial: "Historial", usuarios: "Usuarios", configuracion: "Configuración",
  superadmin: "Superadmin",
  // actions
  nuevo: "Nuevo", nueva: "Nueva", editar: "Editar",
  // CRM
  crm: "CRM", empresas: "Empresas", contactos: "Contactos", leads: "Leads",
  oportunidades: "Oportunidades", pipeline: "Pipeline", actividades: "Actividades",
  agenda: "Agenda", segmentos: "Segmentos", reportes: "Reportes",
  // Mensajería
  mensajes: "Mensajes", notificaciones: "Notificaciones",
  participantes: "Participantes", archivos: "Archivos", tareas: "Tareas",
  // Logística
  "transporte-comprador": "Transporte propio", "flota-vendedor": "Flota del vendedor",
  flota: "Flota", vehiculos: "Vehículos", conductores: "Conductores",
  retiros: "Retiros", reservas: "Reserva", operadores: "Operadores",
  ofertas: "Ofertas", comparar: "Comparar", entregas: "Prueba de entrega",
  // Tracking
  tracking: "Tracking",
  // Finanzas
  facturas: "Facturas", comisiones: "Comisiones",
  // Analítica
  analitica: "Analítica",
  // ERP
  erp: "ERP / Odoo",
  // Checkout
  checkout: "Checkout",
  reviews: "Reputación",
  perfil: "Mi perfil",
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Nuevo pedido #ORD-1042 recibido", time: "hace 5 min", read: false },
  { id: 2, text: "Documento ICA próximo a vencer (35 días)", time: "hace 1 h", read: false },
  { id: 3, text: "Liquidación #LIQ-087 procesada", time: "hace 3 h", read: true },
];

export function DashboardTopbar() {
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unread = notifications.filter(n => !n.read).length;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: BREADCRUMB_LABELS[seg] ?? (seg.length > 16 ? seg.slice(0, 8) + "…" : seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  const pageTitle = crumbs[crumbs.length - 1]?.label ?? "Dashboard";

  return (
    <header className="h-14 flex items-center px-6 bg-white border-b border-[var(--color-border-subtle)] gap-4 flex-shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm flex-1 min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight size={12} className="text-[var(--color-border-subtle)] flex-shrink-0" />}
            {crumb.isLast ? (
              <span className="font-semibold text-[var(--color-on-surface)] truncate">{crumb.label}</span>
            ) : (
              <span className="text-[var(--color-on-surface-variant)] truncate">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Search (decorative) */}
      <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-lg hover:border-[var(--color-primary)]/40 transition-colors min-w-[160px]">
        <Search size={13} />
        <span className="text-xs">Buscar...</span>
        <span className="ml-auto text-[10px] font-mono bg-white border border-[var(--color-border-subtle)] px-1 rounded">⌘K</span>
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors"
        >
          <Bell size={16} className="text-[var(--color-on-surface-variant)]" />
          {unread > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[var(--color-secondary)] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
              {unread}
            </span>
          )}
        </button>

        {showNotif && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowNotif(false)} />
            <div className="absolute right-0 top-10 z-40 w-80 bg-white rounded-xl shadow-lg border border-[var(--color-border-subtle)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
                <h4 className="text-sm font-semibold">Notificaciones</h4>
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-xs text-[var(--color-primary)] hover:underline"
                >
                  Marcar todo leído
                </button>
              </div>
              <div>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className={`flex gap-3 px-4 py-3 text-xs cursor-pointer hover:bg-[var(--color-surface-container-low)] border-b border-[var(--color-border-subtle)] last:border-0 transition-colors ${n.read ? "opacity-60" : ""}`}
                  >
                    <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.read ? "bg-transparent" : "bg-[var(--color-primary)]"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--color-on-surface)]">{n.text}</p>
                      <p className="text-[var(--color-on-surface-variant)] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center border-t border-[var(--color-border-subtle)]">
                <button className="text-xs text-[var(--color-primary)] hover:underline">Ver todas las notificaciones</button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
