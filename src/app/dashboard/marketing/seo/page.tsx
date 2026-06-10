"use client";

import { useState } from "react";
import { Globe, Image, Edit, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const MOCK_BANNERS = [
  { id: "b1", nombre: "Banner hero principal", zona: "Home", dimensiones: "1440x500", status: "activo", ctr: "4.2%" },
  { id: "b2", nombre: "Banner categorías agro", zona: "Catálogo", dimensiones: "300x250", status: "activo", ctr: "2.8%" },
  { id: "b3", nombre: "Banner promo fertilizantes", zona: "Sidebar", dimensiones: "300x600", status: "inactivo", ctr: "1.1%" },
];

const MOCK_META_ISSUES = [
  { pagina: "/productos/glifosato-480-sl", issue: "Meta description faltante", severity: "alta" },
  { pagina: "/categorias/herbicidas", issue: "Título duplicado", severity: "media" },
  { pagina: "/blog/guia-fertilizacion", issue: "Alt text en imágenes faltante", severity: "baja" },
];

export default function SeoPage() {
  const [banners] = useState(MOCK_BANNERS);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">SEO y Banners</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">Gestión de contenido visual y optimización orgánica</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Score SEO", valor: "72", sub: "/100", color: "text-yellow-600" },
          { label: "Páginas indexadas", valor: "148", sub: "de 162", color: "text-[var(--color-primary)]" },
          { label: "Errores críticos", valor: "2", sub: "requieren atención", color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}<span className="text-sm font-normal text-[var(--color-on-surface-variant)]">{s.sub}</span></p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><Image size={15} className="text-[var(--color-primary)]" /> Banners activos</h2>
          <div className="space-y-3">
            {banners.map(b => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{b.nombre}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{b.zona} · {b.dimensiones} · CTR: {b.ctr}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium ${b.status === "activo" ? "text-green-600" : "text-gray-400"}`}>
                    {b.status === "activo" ? "●" : "○"} {b.status}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded"><Edit size={12} className="text-[var(--color-on-surface-variant)]" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp size={15} className="text-[var(--color-primary)]" /> Problemas SEO detectados</h2>
          <div className="space-y-3">
            {MOCK_META_ISSUES.map((issue, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className={`mt-0.5 flex-shrink-0 ${issue.severity === "alta" ? "text-red-500" : issue.severity === "media" ? "text-yellow-500" : "text-gray-400"}`}>
                  <AlertTriangle size={13} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{issue.issue}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{issue.pagina}</p>
                </div>
                <button className="text-xs text-[var(--color-primary)] hover:underline flex-shrink-0">Corregir</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
