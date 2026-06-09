"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Megaphone, BarChart2, FileText, Tag, Plus, Pencil, Trash2 } from "lucide-react";

const BANNERS = [
  { id: "BNR-001", titulo: "Promoción Temporada Lluvias", img: "banner_temporada.jpg", pagina: "/", desde: "2026-06-01", hasta: "2026-06-30", activo: true, clicks: 1240 },
  { id: "BNR-002", titulo: "Biológicos con 15% OFF", img: "banner_biologicos.jpg", pagina: "/categorias/biologicos", desde: "2026-06-10", hasta: "2026-06-20", activo: true, clicks: 890 },
  { id: "BNR-003", titulo: "Fertilizantes NPK Gran Compra", img: "banner_npk.jpg", pagina: "/categorias/fertilizantes", desde: "2026-06-15", hasta: "2026-06-25", activo: false, clicks: 320 },
];

const CAMPAIGNS = [
  { id: "CAMP-001", nombre: "Descuento Temporada Café", tipo: "cupon", codigo: "CAFE15", descuento: "15%", usos: 48, max_usos: 200, vence: "2026-06-30", activo: true },
  { id: "CAMP-002", nombre: "Primer Compra Nuevos Usuarios", tipo: "descuento_directo", codigo: "NUEVO10", descuento: "10%", usos: 124, max_usos: 500, vence: "2026-12-31", activo: true },
  { id: "CAMP-003", nombre: "Vol. 5+ sacos Fertilizante", tipo: "descuento_directo", codigo: "FERT5", descuento: "8%", usos: 211, max_usos: 300, vence: "2026-06-20", activo: true },
];

const STATS_CONTENT = [
  { metrica: "Visitas Home", valor: "12,480", cambio: "+18%", up: true },
  { metrica: "CTR Banners", valor: "3.2%", cambio: "+0.4%", up: true },
  { metrica: "Cupones usados", valor: "383", cambio: "+45%", up: true },
  { metrica: "Nuevos usuarios", valor: "124", cambio: "+22%", up: true },
];

export default function MarketingDashboard() {
  const [blogForm, setBlogForm] = useState({ titulo: "", slug: "", categoria: "", extracto: "", contenido: "", metaDesc: "" });
  const [showBlog, setShowBlog] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Marketing</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Panel de campañas, contenido y métricas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Campañas activas" value="3" icon={<Megaphone size={20} />} color="primary" />
        <StatsCard title="Cupones activos" value="8" subtitle="383 usos este mes" icon={<Tag size={20} />} color="green" />
        <StatsCard title="CTR promedio" value="3.2%" subtitle="+0.4% vs mayo" icon={<BarChart2 size={20} />} color="orange" trend={{ value: "+0.4%", up: true }} />
        <StatsCard title="Posts publicados" value="12" subtitle="este mes" icon={<FileText size={20} />} color="purple" />
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONTENT.map(s => (
          <div key={s.metrica} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase font-medium">{s.metrica}</p>
            <p className="text-xl font-bold mt-1">{s.valor}</p>
            <p className={`text-xs mt-1 font-medium ${s.up ? "text-[var(--color-agri-green)]" : "text-[var(--color-secondary)]"}`}>
              {s.up ? "▲" : "▼"} {s.cambio} vs mes anterior
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banners */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Banners activos</h2>
            <button className="flex items-center gap-1 text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded-full font-medium">
              <Plus size={12} /> Nuevo banner
            </button>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {BANNERS.map(b => (
              <div key={b.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${b.activo ? "bg-green-500" : "bg-gray-300"}`} />
                      <p className="text-xs font-medium truncate">{b.titulo}</p>
                    </div>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{b.pagina} · {b.desde} → {b.hasta}</p>
                    <p className="text-[10px] text-[var(--color-primary)]">{b.clicks} clicks</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1 hover:bg-[var(--color-surface-container-low)] rounded"><Pencil size={12} className="text-[var(--color-on-surface-variant)]" /></button>
                    <button className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-[var(--color-secondary)]" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campañas / Cupones */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Campañas y cupones</h2>
            <button className="flex items-center gap-1 text-xs bg-[var(--color-agri-green)] text-white px-3 py-1 rounded-full font-medium">
              <Plus size={12} /> Nueva campaña
            </button>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {CAMPAIGNS.map(c => (
              <div key={c.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium">{c.nombre}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <code className="text-[10px] bg-[var(--color-surface-container)] px-2 py-0.5 rounded font-mono">{c.codigo}</code>
                      <span className="text-[10px] font-bold text-[var(--color-agri-green)]">{c.descuento}</span>
                      <span className="text-[10px] text-[var(--color-on-surface-variant)]">{c.usos}/{c.max_usos} usos · Vence {c.vence}</span>
                    </div>
                    <div className="mt-1.5 bg-[var(--color-surface-container)] rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[var(--color-primary)]" style={{ width: `${(c.usos / c.max_usos) * 100}%` }} />
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${c.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {c.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Blog */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2"><FileText size={14} /> Editor de blog</h2>
          <button onClick={() => setShowBlog(!showBlog)} className="text-xs text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1 rounded-full">
            {showBlog ? "Cerrar editor" : "+ Nuevo artículo"}
          </button>
        </div>
        {showBlog ? (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="text-xs font-medium">
                Título del artículo
                <input className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Ej: Tendencias en fertilización 2026..."
                  value={blogForm.titulo}
                  onChange={e => setBlogForm(p => ({ ...p, titulo: e.target.value }))}
                />
              </label>
              <label className="text-xs font-medium">
                Categoría
                <select className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  value={blogForm.categoria}
                  onChange={e => setBlogForm(p => ({ ...p, categoria: e.target.value }))}
                >
                  <option value="">Seleccionar categoría...</option>
                  <option>Mercado y tendencias</option>
                  <option>Regulación</option>
                  <option>Agrotecnología</option>
                  <option>Finanzas agro</option>
                  <option>Logística</option>
                </select>
              </label>
            </div>
            <label className="text-xs font-medium block">
              Extracto (máx. 160 caracteres)
              <textarea className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)]"
                rows={2} maxLength={160}
                placeholder="Resumen del artículo para la portada del blog..."
                value={blogForm.extracto}
                onChange={e => setBlogForm(p => ({ ...p, extracto: e.target.value }))}
              />
            </label>
            <label className="text-xs font-medium block">
              Contenido del artículo (Markdown)
              <textarea className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)] font-mono"
                rows={8}
                placeholder="## Introducción&#10;&#10;El contenido del artículo en formato Markdown..."
                value={blogForm.contenido}
                onChange={e => setBlogForm(p => ({ ...p, contenido: e.target.value }))}
              />
            </label>
            <label className="text-xs font-medium block">
              Meta descripción SEO (máx. 160 caracteres)
              <input className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Descripción para Google..."
                maxLength={160}
                value={blogForm.metaDesc}
                onChange={e => setBlogForm(p => ({ ...p, metaDesc: e.target.value }))}
              />
            </label>
            <div className="flex gap-2">
              <button className="text-sm bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">Publicar artículo</button>
              <button className="text-sm border border-[var(--color-border-subtle)] px-6 py-2 rounded-lg text-[var(--color-on-surface-variant)]">Guardar borrador</button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-[var(--color-on-surface-variant)]">
            Haz clic en &quot;+ Nuevo artículo&quot; para abrir el editor
          </div>
        )}
      </div>
    </div>
  );
}
