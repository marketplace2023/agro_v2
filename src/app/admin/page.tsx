import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AdminCharts } from "@/components/dashboard/admin-charts";
import {
  Users, DollarSign, Package, Globe, Settings, Shield, FileText,
  Headphones, BarChart2, Truck, Leaf, ClipboardList, Tag, Warehouse,
  AlertTriangle, Link2,
} from "lucide-react";
import Link from "next/link";

const QUICK_ACCESS = [
  { label: "Usuarios",      href: "/admin/usuarios",      icon: <Users size={20} />,       color: "bg-[var(--color-primary)]" },
  { label: "Configuración", href: "/admin/configuracion", icon: <Settings size={20} />,    color: "bg-[var(--color-tertiary)]" },
  { label: "Auditoría",     href: "/admin/auditoria",     icon: <ClipboardList size={20} />,color: "bg-[var(--color-on-surface-variant)]" },
  { label: "Regulatorio",   href: "/regulatorio",         icon: <Shield size={20} />,       color: "bg-orange-500" },
  { label: "Finanzas",      href: "/dashboard/finanzas",  icon: <DollarSign size={20} />,  color: "bg-[var(--color-agri-green)]" },
  { label: "Soporte",       href: "/dashboard/soporte",   icon: <Headphones size={20} />,  color: "bg-blue-500" },
  { label: "Marketing",     href: "/dashboard/marketing", icon: <Tag size={20} />,          color: "bg-pink-500" },
  { label: "Logística",     href: "/dashboard/logistica", icon: <Truck size={20} />,        color: "bg-amber-500" },
  { label: "Catálogo",      href: "/productos",           icon: <Package size={20} />,      color: "bg-[var(--color-primary)]" },
  { label: "Vendedores",    href: "/vendedores",          icon: <FileText size={20} />,     color: "bg-[var(--color-tertiary)]" },
  { label: "Países",        href: "/paises",              icon: <Globe size={20} />,        color: "bg-teal-500" },
  { label: "Métricas",      href: "/admin",               icon: <BarChart2 size={20} />,   color: "bg-[var(--color-agri-green)]" },
  { label: "Cultivos",      href: "/cultivos",            icon: <Leaf size={20} />,         color: "bg-[var(--color-agri-green)]" },
  { label: "Biblioteca",    href: "/biblioteca",          icon: <FileText size={20} />,     color: "bg-gray-500" },
  { label: "Almacén",       href: "/dashboard/almacen",   icon: <Warehouse size={20} />,   color: "bg-amber-600" },
  { label: "Integraciones", href: "/admin/configuracion", icon: <Link2 size={20} />,        color: "bg-indigo-500" },
];

const heatColors = [
  "bg-gray-100",
  "bg-[var(--color-primary)]/20",
  "bg-[var(--color-primary)]/40",
  "bg-[var(--color-primary)]/60",
  "bg-[var(--color-primary)]/80",
  "bg-[var(--color-primary)]",
];

function formatRelative(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "Ayer" : `Hace ${days} días`;
}

export default async function AdminDashboard() {
  const session = await auth();
  const name = session?.user?.name?.split(" ")[0] ?? "Admin";

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const [userCount, productCount, orderStats, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.product.count({ where: { status: "aprobado" } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: firstDay } },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }).catch(() => []),
  ]);

  const monthTotal = orderStats._sum.totalAmount ?? 0;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Panel de Administración</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Hola, {name} · Marketplace Agro ·{" "}
            {now.toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
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

      {/* KPIs reales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Usuarios registrados"
          value={userCount.toLocaleString("es-CO")}
          subtitle="total en plataforma"
          icon={<Users size={20} />}
          color="primary"
        />
        <StatsCard
          title="Ventas del mes"
          value={`$${monthTotal.toLocaleString("es-CO")}`}
          subtitle={firstDay.toLocaleDateString("es-CO", { month: "long", year: "numeric" })}
          icon={<DollarSign size={20} />}
          color="green"
        />
        <StatsCard
          title="Productos aprobados"
          value={productCount.toLocaleString("es-CO")}
          subtitle="en catálogo activo"
          icon={<Package size={20} />}
          color="orange"
        />
        <StatsCard
          title="Países operando"
          value="15"
          subtitle="en Latinoamérica"
          icon={<Globe size={20} />}
          color="purple"
        />
      </div>

      {/* Gráficas */}
      <AdminCharts />

      {/* Grid accesos rápidos */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h2 className="font-semibold text-sm mb-4">Accesos rápidos a módulos</h2>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_ACCESS.map(a => (
            <Link
              key={a.label}
              href={a.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                {a.icon}
              </div>
              <span className="text-[10px] font-medium text-center text-[var(--color-on-surface)]">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Log de auditoría reciente */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle size={14} /> Actividad reciente
          </h2>
          <Link href="/admin/auditoria" className="text-xs text-[var(--color-primary)] hover:underline">
            Ver log completo →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[var(--color-on-surface-variant)]">
            Sin registros de auditoría aún
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {recentLogs.map((log) => {
              const profile = log.user?.profile;
              const actor = profile
                ? `${profile.firstName} ${profile.lastName}`.trim() || (log.user?.email ?? "Sistema")
                : (log.user?.email ?? "Sistema");
              return (
                <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs font-bold text-[var(--color-on-surface-variant)] shrink-0">
                    {actor.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="font-medium">{actor}</span>
                      <span className="text-[var(--color-on-surface-variant)]"> {log.action}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {log.module && (
                        <span className="text-[10px] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">
                          {log.module}
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--color-on-surface-variant)]">
                        {formatRelative(new Date(log.createdAt))}
                      </span>
                      {log.ipAddress && (
                        <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)]">
                          {log.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
