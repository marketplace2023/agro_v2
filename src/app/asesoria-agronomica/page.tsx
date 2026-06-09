"use client";

import { useState } from "react";
import Link from "next/link";

const CROPS = ["Maíz", "Café", "Tomate", "Papa", "Banano", "Aguacate", "Arroz", "Soya", "Cacao", "Cítricos", "Hortalizas", "Caña de azúcar", "Otro"];
const STAGES = ["Germinación / Establecimiento", "Crecimiento vegetativo", "Floración", "Fructificación / Llenado", "Maduración / Cosecha"];
const SYMPTOMS = ["Amarillamiento de hojas", "Manchas foliares", "Defoliación", "Falta de vigor", "Plagas visibles", "Podredumbre", "Marchitez", "Problemas de raíz", "Otro"];
const URGENCIES = [
  { value: "baja", label: "Baja — Tengo tiempo de esperar 2-3 días" },
  { value: "media", label: "Media — Necesito respuesta en 24 horas" },
  { value: "alta", label: "Alta — Es urgente, el cultivo está en riesgo" },
];

export default function AsesoriaAgronomicaPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    crop: "", stage: "", symptoms: [] as string[],
    description: "", photos: [] as string[],
    urgency: "media", soilAnalysis: false, location: "",
    contact: "",
  });

  function toggleSymptom(s: string) {
    setForm((f) => ({ ...f, symptoms: f.symptoms.includes(s) ? f.symptoms.filter((x) => x !== s) : [...f.symptoms, s] }));
  }

  if (submitted) {
    return (
      <div className="container-max py-12 max-w-lg text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">Solicitud de diagnóstico recibida</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-2">
          Tu solicitud fue registrada con ID: <strong>DIAG-{Math.floor(Math.random() * 9000 + 1000)}</strong>
        </p>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          Un asesor agronómico especialista en {form.crop} te contactará dentro del plazo acordado.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-container)] transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-8 max-w-xl">
      <div className="mb-6">
        <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline">← Inicio</Link>
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)] mt-3">Solicitar asesoría agronómica</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Un especialista te diagnosticará y recomendará el tratamiento adecuado
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {["Contexto", "Síntomas", "Confirmación"].map((label, i) => (
          <div key={i} className={`flex items-center gap-1 ${i < 2 ? "flex-1" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= step ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i + 1 === step ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-on-surface-variant)]"}`}>{label}</span>
            {i < 2 && <div className="flex-1 h-px bg-[var(--color-border-subtle)] ml-1" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 space-y-5">
        {step === 1 && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Cultivo afectado *</label>
              <select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                <option value="">Seleccionar...</option>
                {CROPS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Etapa del cultivo</label>
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                <option value="">Seleccionar...</option>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ubicación (país / departamento)</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ej: Colombia, Antioquia" className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <button onClick={() => { if (!form.crop) return; setStep(2); }}
              className="w-full py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">
              Continuar →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Síntomas observados *</label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSymptom(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.symptoms.includes(s) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Descripción detallada</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe cuándo apareció, qué parte de la planta está afectada, qué porcentaje del cultivo..." className="w-full min-h-[100px] px-3 py-2 rounded-md border border-[var(--color-border-subtle)] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Urgencia</label>
              {URGENCIES.map((u) => (
                <label key={u.value} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="urgency" value={u.value} checked={form.urgency === u.value} onChange={(e) => setForm({ ...form, urgency: e.target.value })} />
                  <span className="text-sm">{u.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface-container-low)]">← Anterior</button>
              <button type="button" onClick={() => setStep(3)} className="flex-1 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">Continuar →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-[var(--color-surface-container-low)] rounded-lg p-4 text-sm space-y-1.5">
              <p><span className="font-medium">Cultivo:</span> {form.crop || "—"}</p>
              <p><span className="font-medium">Etapa:</span> {form.stage || "—"}</p>
              <p><span className="font-medium">Síntomas:</span> {form.symptoms.join(", ") || "—"}</p>
              <p><span className="font-medium">Urgencia:</span> {URGENCIES.find((u) => u.value === form.urgency)?.label}</p>
              <p><span className="font-medium">Ubicación:</span> {form.location || "—"}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Teléfono o email de contacto *</label>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required
                placeholder="Para que el asesor te contacte" className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface-container-low)]">← Anterior</button>
              <button type="button" onClick={() => { if (!form.contact) return; setSubmitted(true); }}
                className="flex-1 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">
                Enviar solicitud ✓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
