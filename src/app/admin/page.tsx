import { auth } from "@/lib/auth/config";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AdminCharts } from "@/components/dashboard/admin-charts";
import { Users, DollarSign, Package, Globe, Settings, Shield, FileText, Headphones, BarChart2, Truck, Leaf, ClipboardList, Tag, Warehouse, AlertTriangle, Link2 } from "lucide-react";
import Link from "next/link";

const RECENT_ACTIONS = [
  { usuario: "Ana Regulatoria", accion: "Aprobó registro ICA para Imidacloprid 350 SC", modulo: "Regulatorio", hora: "Hoy 10:22", ip: "192.168.1.45" },
  { usuario: "María Vendedora", accion: "Publicó 3 nuevos productos en Categoría Biológicos", modulo: "Catálogo", hora: "Hoy 09:48", ip: "192.168.1.82" },
  { usuario: "Admin Sistema", accion: "Actualizó comisión Fertilizantes: 6% → 7%", modulo: "Configuración", hora: "Hoy 08:30", ip: "192.168.1.1" },
  { usuario: "Carlos Comprador", accion: "Completó orden ORD-2024-090 — $3,400", modulo: "Órdenes", hora: "Ayer 17:40", ip: "190.24.180.12" },
  { usuario: "Agente Soporte", accion: "Resolvió ticket TKT-2024-401 — Daño producto", modulo: "Soporte", hora: "Ayer 16:15", ip: "192.168.1.90" },
];

const QUICK_ACCESS = [
  { label: "Usuarios", href: "/admin/usuarios", icon: <Users size={20} />, color: "bg-[var(--color-primary)]", count: "1,247" },
  { label: "Configuración", href: "/admin/configuracion", icon: <Settings size={20} />, color: "bg-[var(--color-tertiary)]", count: "4 tabs" },
  { label: "Auditoría", href: "/admin/auditoria", icon: <ClipboardList size={20} />, color: "bg-[var(--color-on-surface-variant)]", count: "Ver log" },
  { label: "Regulatorio", href: "/regulatorio", icon: <Shield size={20} />, color: "bg-orange-500", count: "12 pendientes" },
  { label: "Finanzas", href: "/dashboard/finanzas", icon: <DollarSign size={20} />, color: "bg-[var(--color-agri-green)]", count: "$284k/mes" },
  { label: "Soporte", href: "/dashboard/soporte", icon: <Headphones size={20} />, color: "bg-blue-500", count: "18 tickets" },
  { label: "Marketing", href: "/dashboard/marketing", icon: <Tag size={20} />, color: "bg-pink-500", count: "3 campañas" },
  { label: "Logística", href: "/dashboard/logistica", icon: <Truck size={20} />, color: "bg-amber-500", count: "24 tránsito" },
  { label: "Catálogo", href: "/productos", icon: <Package size={20} />, color: "bg-[var(--color-primary)]", count: "4,892 SKUs" },
  { label: "Vendedores", href: "/vendedores", icon: <FileText size={20} />, color: "bg-[var(--color-tertiary)]", count: "142 activos" },
  { label: "Países", href: "/paises", icon: <Globe size={20} />, color: "bg-teal-500", count: "15 países" },
  { label: "Métricas", href: "/admin", icon: <BarChart2 size={20} />, color: "bg-[var(--color-agri-green)]", count: "Recharts" },
  { label: "Cultivos", href: "/cultivos", icon: <Leaf size={20} />, color: "bg-[var(--color-agri-green)]", count: "16 cultivos" },
  { label: "Biblioteca", href: "/biblioteca", icon: <FileText size={20} />, color: "bg-gray-500", count: "248 docs" },
  { label: "Almacén", href: "/dashboard/almacen", icon: <Warehouse size={20} />, color: "bg-amber-600", count: "892 SKUs" },
  { label: "Integraciones", href: "/admin/configuracion", icon: <Link2 size={20} />, color: "bg-indigo-500", count: "Odoo · Stripe" },
];

const COUNTRY_HEAT = [
  { pais: "🇨🇴 Colombia", ventas: 284000, usuarios: 4820, productos: 2140, nivel: 5 },
  { pais: "🇲🇽 México", ventas: 148000, usuarios: 2190, productos: 980, nivel: 4 },
  { pais: "🇪🇨 Ecuador", ventas: 89000, usuarios: 1240, productos: 640, nivel: 3 },
  { pais: "🇵🇪 Perú", ventas: 72000, usuarios: 1080, productos: 520, nivel: 3 },
  { pais: "🇻🇪 Venezuela", ventas: 41000, usuarios: 890, productos: 280, nivel: 2 },
  { pais: "🇧🇷 Brasil", ventas: 38000, usuarios: 640, productos: 210, nivel: 2 },
  { pais: "🇦🇷 Argentina", ventas: 29000, usuarios: 480, productos: 180, nivel: 1 },
  { pais: "🇨🇱 Chile", ventas: 22000, usuarios: 380, productos: 160, nivel: 1 },
];

const heatColors = ["bg-gray-100", "bg-[var(--color-primary)]/20", "bg-[var(--color-primary)]/40", "bg-[var(--color-primary)]/60", "bg-[var(--color-primary)]/80", "bg-[var(--color-primary)]"];

export default async function AdminDashboard() {
  const session = await auth();
  const name = session?.user?.name?.split(" ")[0] ?? "Admin";

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Panel de Administración</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Hola, {name} · Marketplace Agro · {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/configuracion" className="text-xs border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[var(--color-surface-container-low)]">
            <Settings size={12} /> Configuración
          </Link>
          <Link href="/admin/auditoria" className="text-xs bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <ClipboardList size={12} /> Auditoría
          </Link>
        </div>
      </div>

      {/* KPIs globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Usuarios activos" value="1,247" subtitle="+124 este mes" icon={<Users size={20} />} color="primary" trend={{ value: "+11.1%", up: true }} />
        <StatsCard title="Ventas del mes" value="$284,000" subtitle="vs $248k mayo" icon={<DollarSign size={20} />} color="green" trend={{ value: "+14.5%", up: true }} />
        <StatsCard title="Productos activos" value="4,892" subtitle="en 8 categorías" icon={<Package size={20} />} color="orange" />
        <StatsCard title="Países operando" value="15" subtitle="en Latinoamérica" icon={<Globe size={20} />} color="purple" />
      </div>

      {/* Gráficas */}
      <AdminCharts />

      {/* Mapa de calor por país */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Globe size={14} /> Actividad por país — Junio 2026</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["País", "Ventas mes", "Usuarios", "Productos activos", "Actividad"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNTRY_HEAT.map(c => (
                <tr key={c.pais} className="border-t border-[var(--color-border-subtle)]">
                  <td className="px-4 py-3 font-medium">{c.pais}</td>
                  <td className="px-4 py-3 font-bold text-[var(--color-agri-green)]">${c.ventas.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.usuarios.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.productos.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <div key={n} className={`w-4 h-4 rounded ${n <= c.nivel ? heatColors[c.nivel] : "bg-gray-100"}`} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid 16 accesos rápidos */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h2 className="font-semibold text-sm mb-4">Accesos rápidos a módulos</h2>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_ACCESS.map(a => (
            <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:shadow-sm transition-all group">
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                {a.icon}
              </div>
              <span className="text-[10px] font-medium text-center text-[var(--color-on-surface)]">{a.label}</span>
              <span className="text-[9px] text-[var(--color-on-surface-variant)] text-center">{a.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Log de auditoría reciente */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2"><AlertTriangle size={14} /> Actividad reciente</h2>
          <Link href="/admin/auditoria" className="text-xs text-[var(--color-primary)] hover:underline">Ver log completo →</Link>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {RECENT_ACTIONS.map((a, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs font-bold text-[var(--color-on-surface-variant)] shrink-0">
                {a.usuario.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs">
                  <span className="font-medium">{a.usuario}</span>
                  <span className="text-[var(--color-on-surface-variant)]"> {a.accion}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">{a.modulo}</span>
                  <span className="text-[10px] text-[var(--color-on-surface-variant)]">{a.hora}</span>
                  <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)]">{a.ip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
