"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Leaf } from "lucide-react";

type PlanType = "fertilizacion" | "fitosanitario" | "nutricion_foliar" | "manejo_integrado";

interface Application {
  id: string; week: number; product: string; dose: string; unit: string; method: string; objective: string;
}

const PRODUCTS = ["Glifosato 480 SL", "NPK 15-15-15", "Beauveria bassiana WP", "Abamectina 1.8 EC", "Sulfato de Potasio 50%", "Cobre Metalaxil WP", "Foliar Zinc 8%", "Urea 46%"];
const BUYERS = [
  { id: "b1", name: "Hacienda El Palmar SAS", contact: "Jorge Martínez" },
  { id: "b2", name: "Finca El Progreso", contact: "Carlos Comprador" },
  { id: "b3", name: "Agroinsumos Norte SRL", contact: "Luis Hernández" },
];

const PLAN_TYPES: Record<PlanType, string> = {
  fertilizacion: "Plan de fertilización",
  fitosanitario: "Plan fitosanitario",
  nutricion_foliar: "Nutrición foliar",
  manejo_integrado: "Manejo integrado de plagas (MIP)",
};

export default function NuevoPlanPage() {
  const router = useRouter();
  const [planType, setPlanType] = useState<PlanType>("fertilizacion");
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("ha");
  const [stage, setStage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("12");
  const [objectives, setObjectives] = useState("");
  const [soilAnalysis, setSoilAnalysis] = useState("");
  const [applications, setApplications] = useState<Application[]>([
    { id: "app1", week: 1, product: "", dose: "", unit: "kg/ha", method: "Suelo", objective: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function addApp() {
    const lastWeek = applications.length > 0 ? Math.max(...applications.map(a => a.week)) : 0;
    setApplications(prev => [...prev, { id: `app${Date.now()}`, week: lastWeek + 1, product: "", dose: "", unit: "kg/ha", method: "Suelo", objective: "" }]);
  }

  function removeApp(id: string) { setApplications(prev => prev.filter(a => a.id !== id)); }
  function updateApp(id: string, field: keyof Application, value: string | number) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push("/dashboard/asesor");
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/asesor" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div><h1 className="text-headline-md font-bold">Nuevo plan agronómico</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Define el plan y programa las aplicaciones</p></div>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-5">
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm">Información general</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Tipo de plan</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.entries(PLAN_TYPES) as [PlanType, string][]).map(([k, label]) => (
                  <button key={k} type="button" onClick={() => setPlanType(k)} className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors text-left ${planType === k ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>{label}</button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Cliente / Empresa *</label>
              <select value={selectedBuyer} onChange={e => setSelectedBuyer(e.target.value)} required className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]">
                <option value="">Seleccionar cliente...</option>
                {BUYERS.map(b => <option key={b.id} value={b.id}>{b.name} — {b.contact}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Cultivo *</label>
              <input value={crop} onChange={e => setCrop(e.target.value)} placeholder="Ej: Maíz amarillo, Soya, Arroz" required className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Etapa fenológica</label>
              <input value={stage} onChange={e => setStage(e.target.value)} placeholder="Ej: Vegetativa, Floración, Fructificación" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Área</label>
              <div className="flex gap-2">
                <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="50" className="flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
                <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none">
                  <option value="ha">ha</option><option value="m2">m²</option><option value="acres">acres</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Fecha de inicio</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Duración (semanas)</label>
              <input type="number" value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Objetivos del plan</label>
              <textarea value={objectives} onChange={e => setObjectives(e.target.value)} rows={2} placeholder="Describe los objetivos agronómicos y productivos del plan..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
            </div>
            {planType === "fertilizacion" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Resultados de análisis de suelo</label>
                <textarea value={soilAnalysis} onChange={e => setSoilAnalysis(e.target.value)} rows={2} placeholder="pH, N-P-K, MO, etc." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-1.5"><Leaf size={14} className="text-[var(--color-agri-green)]" /> Programa de aplicaciones</h2>
            <button type="button" onClick={addApp} className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] border border-[var(--color-primary)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-primary)]/5"><Plus size={12} /> Agregar</button>
          </div>
          <div className="space-y-3">
            {applications.map((app, i) => (
              <div key={app.id} className="border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Aplicación #{i + 1}</span>
                  <button type="button" onClick={() => removeApp(app.id)} className="p-1 hover:bg-red-50 rounded text-red-400"><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Semana</label>
                    <input type="number" min={1} value={app.week} onChange={e => updateApp(app.id, "week", parseInt(e.target.value))} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1">Producto</label>
                    <select value={app.product} onChange={e => updateApp(app.id, "product", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-1.5 text-sm outline-none">
                      <option value="">Seleccionar...</option>
                      {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Dosis</label>
                    <input value={app.dose} onChange={e => updateApp(app.id, "dose", e.target.value)} placeholder="2.5" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Unidad</label>
                    <select value={app.unit} onChange={e => updateApp(app.id, "unit", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-1.5 text-sm outline-none">
                      {["kg/ha", "L/ha", "g/ha", "mL/ha", "cc/ha"].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1">Método de aplicación</label>
                    <select value={app.method} onChange={e => updateApp(app.id, "method", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-1.5 text-sm outline-none">
                      {["Suelo", "Foliar", "Drench", "Fertiriego", "Banda", "Aspersión"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium mb-1">Objetivo de la aplicación</label>
                    <input value={app.objective} onChange={e => updateApp(app.id, "objective", e.target.value)} placeholder="Ej: Corrección deficiencia de nitrógeno" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-sm">Observaciones y recomendaciones adicionales</h2>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Consideraciones especiales, restricciones de mercado, periodos de carencia, etc." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
        </div>

        <div className="flex items-center justify-between">
          <Link href="/dashboard/asesor" className="text-sm text-[var(--color-on-surface-variant)]">Cancelar</Link>
          <button type="submit" disabled={saving || !selectedBuyer || !crop} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"><Save size={14} />{saving ? "Guardando..." : "Guardar plan"}</button>
        </div>
      </form>
    </div>
  );
}
