import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Download, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Biblioteca Técnica | Marketplace Agro",
  description: "Repositorio de fichas técnicas, hojas de seguridad SDS, guías de aplicación, certificados y documentos regulatorios para agroinsumos.",
};

const DOC_TYPES = ["Todos", "Ficha técnica", "Hoja de seguridad (SDS)", "Guía de aplicación", "Certificado de calidad", "Normativa"];

const DOCUMENTS = [
  { id: "1", title: "Guía de fertilización para maíz en trópico bajo", type: "Guía de aplicación", category: "Fertilizantes", crop: "Maíz", source: "Fertiagro", date: "2025-03", lang: "ES", size: "2.4 MB" },
  { id: "2", title: "Ficha técnica — Glifosato 480 SL", type: "Ficha técnica", category: "Herbicidas", crop: "Varios", source: "AgroQuim", date: "2025-01", lang: "ES", size: "890 KB" },
  { id: "3", title: "Hoja de seguridad SDS — Mancozeb 80 WP", type: "Hoja de seguridad (SDS)", category: "Fungicidas", crop: "Varios", source: "CropProtect", date: "2024-11", lang: "ES", size: "1.1 MB" },
  { id: "4", title: "Manual de manejo integrado de plagas en tomate", type: "Guía de aplicación", category: "Insecticidas", crop: "Tomate", source: "Marketplace Agro", date: "2025-02", lang: "ES", size: "4.2 MB" },
  { id: "5", title: "Ficha técnica — Urea Granulada 46% N", type: "Ficha técnica", category: "Fertilizantes", crop: "Varios", source: "Fertiagro", date: "2024-12", lang: "ES", size: "650 KB" },
  { id: "6", title: "Guía de aplicación de biológicos en café", type: "Guía de aplicación", category: "Biológicos", crop: "Café", source: "BioSolutions", date: "2025-04", lang: "ES", size: "3.1 MB" },
  { id: "7", title: "Normativa ICA — Registro de plaguicidas Colombia 2025", type: "Normativa", category: "Regulatorio", crop: "N/A", source: "ICA Colombia", date: "2025-01", lang: "ES", size: "5.8 MB" },
  { id: "8", title: "Certificado de análisis — Trichoderma harzianum Lote 2025A", type: "Certificado de calidad", category: "Biológicos", crop: "Varios", source: "BioSolutions", date: "2025-03", lang: "ES", size: "320 KB" },
];

const TYPE_ICONS: Record<string, string> = {
  "Ficha técnica": "📄",
  "Hoja de seguridad (SDS)": "⚠️",
  "Guía de aplicación": "📗",
  "Certificado de calidad": "✅",
  "Normativa": "⚖️",
};

export default function BibliotecaPage() {
  return (
    <div className="container-max py-8">
      <div className="mb-6">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Biblioteca técnica</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Fichas técnicas, SDS, guías de aplicación y normativas para agroinsumos
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {DOC_TYPES.map((t) => (
            <button key={t} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${t === "Todos" ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCUMENTS.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{TYPE_ICONS[doc.type] ?? "📄"}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-on-surface)] line-clamp-2">{doc.title}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{doc.type}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">· {doc.category}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">· {doc.source}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{doc.date}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">· {doc.size}</span>
                  <span className="text-xs bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">{doc.lang}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">
                <Download className="w-3 h-3" /> Descargar
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors">
                <ExternalLink className="w-3 h-3" /> Ver
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-subtle)] p-6 text-center">
        <p className="font-semibold text-[var(--color-on-surface)] mb-1">¿Eres vendedor o fabricante?</p>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-3">
          Sube las fichas técnicas y documentos de tus productos para aumentar la confianza de los compradores
        </p>
        <Link href="/dashboard/vendedor" className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-container)] transition-colors">
          <FileText className="w-4 h-4" /> Subir documentos
        </Link>
      </div>
    </div>
  );
}
