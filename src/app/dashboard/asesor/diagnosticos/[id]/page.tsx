"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, ShoppingCart, FileText, Leaf, Droplets, Bug, Zap } from "lucide-react";

const MOCK_DIAGNOSTICO = {
  id: "d1", ticketNum: "DIAG-2026-0234", buyer: "Carlos Mendoza", company: "Finca El Progreso", email: "cmendoza@fincaelprogreso.com", phone: "+57 310 555 0099",
  crop: "Tomate", cropStage: "Fructificación", location: "Valle del Cauca, Colombia", area: "5 hectáreas",
  problem: "Plantas presentan hojas con manchas amarillas con bordes cafés, que progresan desde las hojas inferiores hacia arriba. Se observa defoliación en un 30% de las plantas. El problema empezó hace 2 semanas después de lluvias intensas.",
  symptoms: ["Manchas foliares amarillo-cafés", "Defoliación prematura", "Inicio en hojas basales", "Progresión ascendente"],
  photos: ["foto_hoja_1.jpg", "foto_campo_2.jpg", "foto_detalle_3.jpg"],
  soilAnalysis: "pH 6.2, N: bajo, P: medio, K: alto, Mg: deficiente",
  previousProducts: "Se aplicó Mancozeb 80% hace 3 semanas sin resultado claro.",
  urgency: "alta", status: "pendiente", createdAt: "2026-06-09",
};

const RECOMMENDED_PRODUCTS = [
  { id: "p1", name: "Azoxistrobina + Ciproconazol", category: "Fungicida sistémico", dose: "0.8 L/ha", frequency: "Cada 14 días", price: 52, unit: "Lt" },
  { id: "p2", name: "Sulfato de Magnesio Soluble", category: "Fertilizante", dose: "3 kg/ha foliar", frequency: "Cada 10 días", price: 18, unit: "kg" },
  { id: "p3", name: "Caldo bordelés 20 WP", category: "Fungicida cúprico", dose: "2 kg/ha", frequency: "Preventivo mensual", price: 28, unit: "kg" },
];

export default function DiagnosticoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState("");
  const [cause, setCause] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [followUpDate, setFollowUpDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleProduct(id: string) { setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!diagnosis.trim() || !cause.trim() || !recommendations.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false); setSubmitted(true);
    setTimeout(() => router.push("/dashboard/asesor"), 2000);
  }

  const d = MOCK_DIAGNOSTICO;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/asesor" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div><h1 className="text-headline-md font-bold">Diagnóstico {d.ticketNum}</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Respuesta agronómica</p></div>
      </div>

      {submitted && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2"><CheckCircle size={14} /> Diagnóstico enviado al comprador. Redirigiendo...</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Case info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-sm">Información del caso</h2>
            <div className="space-y-2 text-sm">
              <div><p className="text-xs text-[var(--color-on-surface-variant)]">Agricultor</p><p className="font-medium">{d.buyer}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{d.company}</p></div>
              <div className="flex gap-1 items-center"><Leaf size={13} className="text-[var(--color-agri-green)] flex-shrink-0" /><div><p className="text-xs text-[var(--color-on-surface-variant)]">Cultivo</p><p className="font-medium">{d.crop} · {d.cropStage}</p></div></div>
              <div><p className="text-xs text-[var(--color-on-surface-variant)]">Ubicación</p><p className="text-sm">{d.location} · {d.area}</p></div>
              <div><p className="text-xs text-[var(--color-on-surface-variant)]">Urgencia</p><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d.urgency === "alta" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>Urgencia {d.urgency}</span></div>
              <div><p className="text-xs text-[var(--color-on-surface-variant)]">Análisis de suelo</p><p className="text-xs">{d.soilAnalysis}</p></div>
              <div><p className="text-xs text-[var(--color-on-surface-variant)]">Productos anteriores</p><p className="text-xs">{d.previousProducts}</p></div>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-sm">Descripción del problema</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{d.problem}</p>
            <div>
              <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5">Síntomas observados</p>
              <ul className="space-y-1">
                {d.symptoms.map(s => <li key={s} className="flex items-center gap-1.5 text-xs"><Bug size={10} className="text-orange-500 flex-shrink-0" />{s}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5">Fotos adjuntas ({d.photos.length})</p>
              <div className="flex gap-2">{d.photos.map(p => <div key={p} className="w-16 h-16 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-border-subtle)] flex items-center justify-center text-xs text-[var(--color-on-surface-variant)] text-center px-1">{p.split("_")[1]}</div>)}</div>
            </div>
          </div>
        </div>

        {/* Response form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
              <h2 className="font-semibold text-sm flex items-center gap-2"><FileText size={14} className="text-[var(--color-primary)]" /> Diagnóstico técnico</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Diagnóstico *</label>
                <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={3} required placeholder="Indica la enfermedad, plaga o deficiencia identificada con base en los síntomas..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Causa probable *</label>
                <textarea value={cause} onChange={e => setCause(e.target.value)} rows={2} required placeholder="Agente causal, condiciones predisponentes, factores ambientales..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Recomendaciones y plan de manejo *</label>
                <textarea value={recommendations} onChange={e => setRecommendations(e.target.value)} rows={4} required placeholder="Plan de aplicación, dosis, frecuencia, medidas culturales, precauciones..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Fecha de seguimiento</label>
                <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>

            {/* Product recommendations */}
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
              <h2 className="font-semibold text-sm flex items-center gap-2"><ShoppingCart size={14} className="text-[var(--color-primary)]" /> Productos recomendados del catálogo</h2>
              <p className="text-xs text-[var(--color-on-surface-variant)]">Selecciona los productos que recomiendas. El comprador podrá agregarlos directamente al carrito.</p>
              <div className="space-y-2">
                {RECOMMENDED_PRODUCTS.map(prod => (
                  <div key={prod.id} onClick={() => toggleProduct(prod.id)} className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedProducts.includes(prod.id) ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50"}`}>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={selectedProducts.includes(prod.id)} readOnly className="w-4 h-4 accent-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div><p className="font-medium text-sm">{prod.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{prod.category}</p></div>
                          <p className="font-bold text-sm text-[var(--color-primary)]">${prod.price}/{prod.unit}</p>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                          <span><Droplets size={10} className="inline mr-0.5" />Dosis: {prod.dose}</span>
                          <span><Zap size={10} className="inline mr-0.5" />Frecuencia: {prod.frequency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/dashboard/asesor" className="text-sm text-[var(--color-on-surface-variant)]">Cancelar</Link>
              <button type="submit" disabled={saving || !diagnosis.trim() || !recommendations.trim()} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60">
                <Send size={14} />{saving ? "Enviando..." : "Enviar diagnóstico"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
