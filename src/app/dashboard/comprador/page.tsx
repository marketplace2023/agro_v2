import { auth } from "@/lib/auth/config";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Package, FileText, DollarSign, Heart, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

const ORDERS = [
  { id: "ORD-2024-001", producto: "Urea Granulada 46%", vendedor: "DistAgroMax", fecha: "2026-06-07", estado: "en_transito", total: "$425.00" },
  { id: "ORD-2024-002", producto: "Mancozeb 80% WP", vendedor: "AgroSuministros CO", fecha: "2026-06-05", estado: "confirmada", total: "$220.00" },
  { id: "ORD-2024-003", producto: "NPK 15-15-15", vendedor: "DistAgroMax", fecha: "2026-06-01", estado: "entregada", total: "$380.00" },
  { id: "ORD-2024-004", producto: "Glifosato 480 SL", vendedor: "DistAgroMax", fecha: "2026-05-28", estado: "entregada", total: "$189.00" },
];

const RFQS = [
  { id: "RFQ-2024-018", producto: "Fosfato Diamónico 50t", vendedores: 4, vence: "2026-06-12", estado: "abierta" },
  { id: "RFQ-2024-019", producto: "Biológico Trichoderma 200kg", vendedores: 2, vence: "2026-06-15", estado: "con_ofertas" },
];

const TRACKING = [
  { orden: "ORD-2024-001", paso: "En tránsito — Bogotá → Medellín", hora: "Hoy 08:22", icon: "🚛" },
  { orden: "ORD-2024-002", paso: "Confirmada — Preparando despacho", hora: "Ayer 15:40", icon: "📦" },
];

const RECOMPRA = [
  { nombre: "Urea Granulada 46%", ultimo: "Hace 30 días", precio: "$42.50/50kg" },
  { nombre: "NPK 15-15-15", ultimo: "Hace 45 días", precio: "$38.00/50kg" },
  { nombre: "Glifosato 480 SL", ultimo: "Hace 15 días", precio: "$18.90/lt" },
];

const STATUS_COLOR: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  confirmada: "bg-blue-100 text-blue-700",
  en_preparacion: "bg-purple-100 text-purple-700",
  en_transito: "bg-orange-100 text-orange-700",
  entregada: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
  con_ofertas: "bg-teal-100 text-teal-700",
  abierta: "bg-blue-100 text-blue-700",
};

export default async function CompradorDashboard() {
  const session = await auth();
  const name = session?.user?.name?.split(" ")[0] ?? "Comprador";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-headline-md font-bold text-[var(--color-on-surface)]">Hola, {name} 👋</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Panel de comprador — {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Órdenes activas" value="3" subtitle="2 en tránsito, 1 confirmada" icon={<Package size={20} />} color="primary" trend={{ value: "+1", up: true }} />
        <StatsCard title="Gasto este mes" value="$4,280" subtitle="vs $3,920 mes anterior" icon={<DollarSign size={20} />} color="green" trend={{ value: "+9.2%", up: true }} />
        <StatsCard title="Cotizaciones" value="2" subtitle="1 con ofertas pendientes" icon={<FileText size={20} />} color="orange" />
        <StatsCard title="Favoritos" value="12" subtitle="3 con precio reducido" icon={<Heart size={20} />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Órdenes recientes */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm text-[var(--color-on-surface)]">Mis órdenes recientes</h2>
            <Link href="/ordenes" className="text-xs text-[var(--color-primary)] font-medium hover:underline">Ver todas →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-surface-container-low)]">
                <tr>
                  {["Orden", "Producto", "Vendedor", "Fecha", "Estado", "Total"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o, i) => (
                  <tr key={o.id} className={`border-t border-[var(--color-border-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--color-surface-container-lowest)]"}`}>
                    <td className="px-4 py-3 text-[var(--color-primary)] font-medium text-xs">{o.id}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[160px]">{o.producto}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{o.vendedor}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{o.fecha}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[o.estado] ?? "bg-gray-100 text-gray-600"}`}>
                        {o.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tracking + alertas */}
        <div className="space-y-4">
          {/* Tracking */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="text-base">🚛</span> Seguimiento activo
            </h3>
            <div className="space-y-3">
              {TRACKING.map(t => (
                <div key={t.orden} className="flex gap-3">
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-[var(--color-on-surface)]">{t.paso}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{t.orden} · {t.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-amber-700">
              <AlertCircle size={15} /> Alertas
            </h3>
            <ul className="space-y-1.5 text-xs text-amber-800">
              <li>• RFQ-2024-018 vence en 3 días — revisa las 4 ofertas</li>
              <li>• Glifosato 480 SL con restricción en VE actualizada</li>
              <li>• Nuevo producto en tu categoría favorita: Biológicos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* RFQs + Recompra rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cotizaciones */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">Cotizaciones activas (RFQ)</h2>
            <Link href="/rfq/nueva" className="text-xs text-white bg-[var(--color-primary)] px-3 py-1 rounded-full font-medium">+ Nueva RFQ</Link>
          </div>
          <div className="p-4 space-y-3">
            {RFQS.map(rfq => (
              <div key={rfq.id} className="flex items-start justify-between p-3 rounded-lg border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] transition-colors">
                <div>
                  <p className="text-xs font-medium">{rfq.producto}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{rfq.id} · {rfq.vendedores} vendedores · Vence: {rfq.vence}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[rfq.estado]}`}>
                  {rfq.estado.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recompra rápida */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm flex items-center gap-2"><RefreshCw size={14} /> Recompra rápida</h2>
          </div>
          <div className="p-4 space-y-3">
            {RECOMPRA.map(p => (
              <div key={p.nombre} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)]">
                <div>
                  <p className="text-xs font-medium">{p.nombre}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">Última compra: {p.ultimo} · {p.precio}</p>
                </div>
                <button className="text-xs font-medium text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  Recomprar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
