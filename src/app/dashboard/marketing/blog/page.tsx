"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Eye, Edit, Trash2, CheckCircle, Clock } from "lucide-react";

const MOCK_ARTICULOS = [
  { id: "art-001", titulo: "Guía completa de fertilización en maíz", categoria: "Nutrición vegetal", autor: "Daniel Marketing", fecha: "2026-06-05", vistas: 1240, status: "publicado" },
  { id: "art-002", titulo: "Control biológico de plagas: el futuro del agro", categoria: "Protección cultivos", autor: "Daniel Marketing", fecha: "2026-06-02", vistas: 876, status: "publicado" },
  { id: "art-003", titulo: "Top 5 herbicidas más efectivos para soya 2026", categoria: "Herbicidas", autor: "Daniel Marketing", fecha: "2026-06-08", vistas: 0, status: "borrador" },
  { id: "art-004", titulo: "Cómo elegir la dosis correcta de fungicida", categoria: "Fungicidas", autor: "Daniel Marketing", fecha: "2026-05-28", vistas: 2100, status: "publicado" },
  { id: "art-005", titulo: "Tendencias del mercado agro en Colombia 2026", categoria: "Mercado", autor: "Daniel Marketing", fecha: "2026-06-09", vistas: 0, status: "borrador" },
];

export default function BlogPage() {
  const [articulos, setArticulos] = useState(MOCK_ARTICULOS);
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? articulos : articulos.filter(a => a.status === filter);

  function deleteArticulo(id: string) {
    setArticulos(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Blog y contenido</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{articulos.filter(a => a.status === "publicado").length} publicados · {articulos.filter(a => a.status === "borrador").length} borradores</p>
        </div>
        <Link href="/dashboard/marketing/blog/nuevo" className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Nuevo artículo
        </Link>
      </div>

      <div className="flex gap-2">
        {["todos", "publicado", "borrador"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Artículo", "Categoría", "Fecha", "Vistas", "Estado", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[var(--color-primary)]/8 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{a.titulo}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{a.autor}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{a.categoria}</td>
                <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{a.fecha}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 font-medium"><Eye size={12} className="text-[var(--color-on-surface-variant)]" /> {a.vistas.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${a.status === "publicado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {a.status === "publicado" ? <CheckCircle size={11} /> : <Clock size={11} />}
                    {a.status === "publicado" ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link href="/dashboard/marketing/blog/nuevo" className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><Edit size={14} /></Link>
                    <button onClick={() => deleteArticulo(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
