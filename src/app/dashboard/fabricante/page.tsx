import { StatsCard } from "@/components/dashboard/stats-card";
import { Leaf, Users, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";

const PRODUCT_LINES = [
  { nombre: "Fertilizantes nitrogenados", productos: 8, paises: ["CO", "VE", "EC", "MX", "PE"], activos: 8, bloqueados: 0 },
  { nombre: "Biológicos — Trichoderma", productos: 4, paises: ["CO", "EC", "PE"], activos: 3, bloqueados: 1 },
  { nombre: "Fungicidas sistémicos", productos: 6, paises: ["CO", "VE", "MX"], activos: 6, bloqueados: 0 },
  { nombre: "Insecticidas", productos: 5, paises: ["CO", "MX"], activos: 4, bloqueados: 1 },
  { nombre: "Herbicidas", productos: 3, paises: ["CO", "VE", "MX", "PE"], activos: 3, bloqueados: 0 },
];

const DISTRIBUTORS = [
  { nombre: "DistAgroMax", pais: "CO", productos: 18, ventas_mes: "$24,800", estado: "activo" },
  { nombre: "AgroSuministros CO", pais: "CO", productos: 12, ventas_mes: "$15,200", estado: "activo" },
  { nombre: "AgroMex S.A.", pais: "MX", productos: 8, ventas_mes: "$11,400", estado: "activo" },
  { nombre: "Agro Ecuador Cia.", pais: "EC", productos: 6, ventas_mes: "$8,900", estado: "en_revision" },
  { nombre: "Agri Peru SAC", pais: "PE", productos: 5, ventas_mes: "$6,200", estado: "activo" },
];

const REGISTROS = [
  { pais: "🇨🇴 Colombia", aprobados: 24, por_vencer: 2, vencidos: 0 },
  { pais: "🇻🇪 Venezuela", aprobados: 8, por_vencer: 3, vencidos: 1 },
  { pais: "🇪🇨 Ecuador", aprobados: 12, por_vencer: 1, vencidos: 0 },
  { pais: "🇲🇽 México", aprobados: 15, por_vencer: 0, vencidos: 0 },
  { pais: "🇵🇪 Perú", aprobados: 9, por_vencer: 2, vencidos: 0 },
];

const RECLAMOS = [
  { id: "REC-2024-014", producto: "Trichoderma Harzianum WP 1kg", comprador: "Finca El Paraíso", tipo: "Calidad — lote defectuoso", fecha: "2026-06-06", estado: "en_proceso" },
];

export default function FabricanteDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Fabricante</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">BioSolutions — Panel de fabricante</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Líneas activas" value="5" subtitle="26 productos en catálogo" icon={<Leaf size={20} />} color="green" />
        <StatsCard title="Distribuidores" value="5" subtitle="activos en 5 países" icon={<Users size={20} />} color="primary" />
        <StatsCard title="Registros vigentes" value="68" subtitle="6 por vencer en 60 días" icon={<Shield size={20} />} color="orange" />
        <StatsCard title="Reclamos calidad" value="1" subtitle="en proceso" icon={<AlertTriangle size={20} />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Líneas de productos */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Líneas de productos por país</h2>
            <Link href="/productos" className="text-xs text-[var(--color-primary)] hover:underline">Gestionar →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {PRODUCT_LINES.map(l => (
              <div key={l.nombre} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium">{l.nombre}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {l.paises.map(p => (
                        <span key={p} className="text-[10px] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded font-mono">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-[var(--color-agri-green)] font-medium">{l.activos} activos</span>
                    {l.bloqueados > 0 && <span className="ml-2 text-[var(--color-secondary)]">{l.bloqueados} bloqueados</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuidores */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Red de distribuidores</h2>
            <Link href="/b2b/empresas" className="text-xs text-[var(--color-primary)] hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {DISTRIBUTORS.map(d => (
              <div key={d.nombre} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium">{d.nombre} <span className="text-[var(--color-on-surface-variant)] font-mono text-[10px]">· {d.pais}</span></p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{d.productos} productos autorizados</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">{d.ventas_mes}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${d.estado === "activo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {d.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registros sanitarios por país */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">Registros sanitarios por país</h2>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["País", "Aprobados", "Por vencer", "Vencidos"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REGISTROS.map(r => (
                <tr key={r.pais} className="border-t border-[var(--color-border-subtle)]">
                  <td className="px-4 py-2.5">{r.pais}</td>
                  <td className="px-4 py-2.5 text-[var(--color-agri-green)] font-medium">{r.aprobados}</td>
                  <td className="px-4 py-2.5 text-amber-600 font-medium">{r.por_vencer}</td>
                  <td className="px-4 py-2.5 text-[var(--color-secondary)] font-medium">{r.vencidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reclamos de calidad */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm flex items-center gap-2 text-amber-700"><AlertTriangle size={14} /> Reclamos de calidad</h2>
          </div>
          <div className="p-4">
            {RECLAMOS.map(r => (
              <div key={r.id} className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-on-surface)]">{r.id}</p>
                    <p className="text-xs mt-0.5">{r.producto}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{r.tipo}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{r.comprador} · {r.fecha}</p>
                  </div>
                  <span className="text-[10px] font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">En proceso</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded font-medium">Ver detalles</button>
                  <button className="text-xs border border-[var(--color-border-subtle)] px-3 py-1 rounded text-[var(--color-on-surface-variant)]">Contactar comprador</button>
                </div>
              </div>
            ))}
            {RECLAMOS.length === 0 && (
              <p className="text-xs text-center text-[var(--color-on-surface-variant)] py-8">Sin reclamos activos ✓</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
