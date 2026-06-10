"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Search, BookOpen } from "lucide-react";

const MOCK_FAQS = [
  { id: "faq-001", pregunta: "¿Cómo genero mi factura electrónica?", respuesta: "Las facturas se generan automáticamente al confirmar el pago. Puedes descargarlas desde tu sección 'Facturas' en el portal. Si no aparece, contacta a soporte con el número de orden.", categoria: "Facturación", vistas: 234 },
  { id: "faq-002", pregunta: "¿Cuánto tiempo tarda un reembolso?", respuesta: "Los reembolsos aprobados se procesan en 3-5 días hábiles. Para tarjetas de crédito puede tomar hasta 2 ciclos de facturación.", categoria: "Pagos", vistas: 187 },
  { id: "faq-003", pregunta: "¿Cómo hago seguimiento de mi pedido?", respuesta: "Ve a la sección 'Rastrear envío' con el número de guía o desde la sección 'Mis órdenes'. Recibirás actualizaciones por correo en cada etapa.", categoria: "Logística", vistas: 312 },
  { id: "faq-004", pregunta: "¿Cómo registro un producto regulado?", respuesta: "Los vendedores deben subir el documento de registro (ICA, SENASICA, AGROCALIDAD según país) desde su dashboard en la sección 'Documentos'. El equipo de regulatorio lo revisará en máximo 3 días hábiles.", categoria: "Regulatorio", vistas: 98 },
];

export default function SoporteFaqPage() {
  const [items] = useState(MOCK_FAQS);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = items.filter(f => f.pregunta.toLowerCase().includes(search.toLowerCase()) || f.respuesta.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Base de conocimiento / FAQ</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{items.length} artículos publicados</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Nuevo artículo
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en la base de conocimiento..." className="w-full pl-9 pr-3 py-2.5 border border-[var(--color-border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--color-primary)]" />
      </div>

      <div className="space-y-2">
        {filtered.map(faq => (
          <div key={faq.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
            <button onClick={() => setExpanded(expanded === faq.id ? null : faq.id)} className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <BookOpen size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{faq.pregunta}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--color-on-surface-variant)]">
                    <span className="bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded-full">{faq.categoria}</span>
                    <span>{faq.vistas} vistas</span>
                  </div>
                </div>
              </div>
              {expanded === faq.id ? <ChevronUp size={16} className="flex-shrink-0 text-[var(--color-on-surface-variant)]" /> : <ChevronDown size={16} className="flex-shrink-0 text-[var(--color-on-surface-variant)]" />}
            </button>
            {expanded === faq.id && (
              <div className="px-4 pb-4 text-sm text-[var(--color-on-surface-variant)] border-t border-[var(--color-border-subtle)] pt-3">
                {faq.respuesta}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
