"use client";

import { useParams } from "next/navigation";
import { FolderOpen, ChevronLeft, Upload, Download, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const ARCHIVOS = [
  { id: "F1", nombre: "Remision_ORD-2026-122.pdf", tipo: "PDF", peso: "148 KB", subidoPor: "María Gómez", fecha: "2026-06-10", mensaje: "Nota de remisión adjunta al despacho" },
  { id: "F2", nombre: "Cotizacion_COT-2026-089.pdf", tipo: "PDF", peso: "92 KB", subidoPor: "María Gómez", fecha: "2026-06-03", mensaje: "Cotización formal enviada al cliente" },
  { id: "F3", nombre: "Analisis_suelo_Palmira.pdf", tipo: "PDF", peso: "234 KB", subidoPor: "Mauricio Torres", fecha: "2026-05-29", mensaje: "Análisis de suelo solicitado por el vendedor" },
  { id: "F4", nombre: "Foto_embalaje_lote.jpg", tipo: "Imagen", peso: "1.2 MB", subidoPor: "Almacén Bogotá", fecha: "2026-06-08", mensaje: "Evidencia de embalaje antes del despacho" },
  { id: "F5", nombre: "Contrato_suministro_B2B.pdf", tipo: "PDF", peso: "318 KB", subidoPor: "María Gómez", fecha: "2026-04-10", mensaje: "Contrato de suministro trimestral firmado" },
];

const TIPO_ICON: Record<string, React.ReactNode> = {
  PDF: <FileText size={20} className="text-red-500" />,
  Imagen: <ImageIcon size={20} className="text-blue-500" />,
};

const TIPO_BG: Record<string, string> = {
  PDF: "bg-red-50",
  Imagen: "bg-blue-50",
};

export default function ArchivosPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/mensajes/${params.id}`} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <FolderOpen size={20} /> Archivos compartidos
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">CONV-001 · {ARCHIVOS.length} archivos</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Upload size={14} /> Subir archivo
        </button>
      </div>

      <div className="space-y-3">
        {ARCHIVOS.map((f) => (
          <div key={f.id} className="flex items-start gap-4 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TIPO_BG[f.tipo]}`}>
              {TIPO_ICON[f.tipo]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{f.nombre}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{f.mensaje}</p>
              <div className="flex gap-3 mt-1 text-[10px] text-[var(--color-on-surface-variant)]">
                <span>{f.peso}</span>
                <span>Subido por {f.subidoPor}</span>
                <span>{f.fecha}</span>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)] shrink-0">
              <Download size={15} />
            </button>
          </div>
        ))}
      </div>

      <Link href={`/mensajes/${params.id}`} className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
        <ChevronLeft size={11} /> Volver a la conversación
      </Link>
    </div>
  );
}
