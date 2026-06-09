import { StatsCard } from "@/components/dashboard/stats-card";
import { MapPin, Package, Users, Warehouse } from "lucide-react";
import Link from "next/link";

const AUTHORIZED_PRODUCTS = [
  { nombre: "Urea Granulada 46% — Fertiagro", contrato: "CONT-2025-001", precio: "$42.50/50kg", stock: 420, min_pedido: "10 sacos" },
  { nombre: "NPK 15-15-15 — Fertiagro", contrato: "CONT-2025-001", precio: "$38.00/50kg", stock: 280, min_pedido: "10 sacos" },
  { nombre: "Glifosato 480 SL — AgroQuim", contrato: "CONT-2025-002", precio: "$18.90/lt", stock: 150, min_pedido: "20L" },
  { nombre: "Trichoderma Harzianum — BioSolutions", contrato: "CONT-2025-003", precio: "$35.00/kg", stock: 80, min_pedido: "5kg" },
];

const REGIONAL_ORDERS = [
  { id: "ORD-2024-201", cliente: "Finca El Roble", municipio: "Chía, Cundinamarca", monto: "$1,240", estado: "en_preparacion" },
  { id: "ORD-2024-202", cliente: "Agro La Sabana", municipio: "Zipaquirá, Cundinamarca", monto: "$3,400", estado: "confirmada" },
  { id: "ORD-2024-203", cliente: "Coop. Boyacenses", municipio: "Tunja, Boyacá", monto: "$8,900", estado: "despachada" },
  { id: "ORD-2024-204", cliente: "Hacienda La Vega", municipio: "Villa de Leyva, Boyacá", monto: "$2,100", estado: "confirmada" },
];

const CLIENTS = [
  { nombre: "Finca El Roble", municipio: "Chía", ultima_compra: "Hace 5 días", total_mes: "$1,240" },
  { nombre: "Agro La Sabana", municipio: "Zipaquirá", ultima_compra: "Hace 3 días", total_mes: "$5,600" },
  { nombre: "Cooperativa Boyacenses", municipio: "Tunja", ultima_compra: "Hoy", total_mes: "$12,400" },
  { nombre: "Hacienda La Vega", municipio: "Villa de Leyva", ultima_compra: "Hace 7 días", total_mes: "$3,200" },
];

const STATUS_COLOR: Record<string, string> = {
  confirmada: "bg-blue-100 text-blue-700",
  en_preparacion: "bg-purple-100 text-purple-700",
  despachada: "bg-green-100 text-green-700",
};

export default function DistribuidorDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Distribuidor</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">AgroSuministros CO · Territorio: Cundinamarca + Boyacá</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Territorio" value="CO-Cund" subtitle="+ Boyacá" icon={<MapPin size={20} />} color="primary" />
        <StatsCard title="Productos autorizados" value="120" subtitle="por contrato marco" icon={<Package size={20} />} color="green" />
        <StatsCard title="Órdenes activas" value="4" subtitle="hoy" icon={<Warehouse size={20} />} color="orange" />
        <StatsCard title="Clientes activos" value="28" subtitle="este mes" icon={<Users size={20} />} color="purple" trend={{ value: "+2", up: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos autorizados */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Productos autorizados (muestra)</h2>
            <Link href="/productos" className="text-xs text-[var(--color-primary)] hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {AUTHORIZED_PRODUCTS.map(p => (
              <div key={p.nombre} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.nombre}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{p.contrato} · Mín: {p.min_pedido}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold">{p.precio}</p>
                    <p className="text-[10px] text-[var(--color-agri-green)]">Stock: {p.stock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos regionales */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Pedidos regionales</h2>
            <Link href="/ordenes" className="text-xs text-[var(--color-primary)] hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {REGIONAL_ORDERS.map(o => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium">{o.cliente}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5 flex items-center gap-1">
                    <MapPin size={9} /> {o.municipio} · {o.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">{o.monto}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[o.estado] ?? "bg-gray-100 text-gray-600"}`}>
                    {o.estado.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clientes regionales */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm">Mis clientes — Mes actual</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["Cliente", "Municipio", "Última compra", "Total mes", "Acción"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map(c => (
                <tr key={c.nombre} className="border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-lowest)]">
                  <td className="px-4 py-3 text-xs font-medium">{c.nombre}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{c.municipio}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{c.ultima_compra}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[var(--color-primary)]">{c.total_mes}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-[var(--color-primary)] border border-[var(--color-primary)] px-2 py-0.5 rounded hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                      Ver perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
