"use client";

import { useState } from "react";

const COUNTRIES = ["Colombia", "Venezuela", "Ecuador", "México", "Perú", "Brasil", "Argentina", "Chile"];
const CROPS = ["Maíz", "Café", "Tomate", "Papa", "Banano", "Aguacate", "Arroz", "Soya", "Cacao"];

export function LeadFormsSection() {
  const [tab, setTab] = useState<"comprar" | "vender" | "cotizar" | "asesoria">("comprar");
  const [submitted, setSubmitted] = useState(false);

  const TABS = [
    { key: "comprar" as const, label: "Quiero comprar" },
    { key: "vender" as const, label: "Quiero vender" },
    { key: "cotizar" as const, label: "Quiero cotizar" },
    { key: "asesoria" as const, label: "Quiero asesoría técnica" },
  ];

  if (submitted) {
    return (
      <section className="py-14 bg-[var(--color-surface-container-low)]">
        <div className="container-max max-w-2xl text-center">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">¡Solicitud recibida!</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
            Un asesor se pondrá en contacto contigo a la brevedad.
          </p>
          <button onClick={() => setSubmitted(false)} className="text-sm text-[var(--color-primary)] hover:underline">
            Enviar otra solicitud
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-[var(--color-surface-container-low)]">
      <div className="container-max max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-headline-md text-[var(--color-on-surface)]">¿Cómo podemos ayudarte?</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Cuéntanos lo que necesitas y te conectamos con el proveedor o experto adecuado
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden shadow-sm">
          <div className="flex border-b border-[var(--color-border-subtle)]">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${tab === t.key ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-6 space-y-4">
            {tab === "comprar" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Producto o categoría</label>
                  <input type="text" placeholder="Ej: Herbicida para maíz, Urea 46%..." className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">País de entrega</label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Cantidad estimada</label>
                    <input type="text" placeholder="Ej: 500 litros" className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Email o teléfono</label>
                  <input type="text" placeholder="tu@empresa.com o +57 300..." className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                </div>
              </>
            )}
            {tab === "vender" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Nombre de empresa</label>
                  <input type="text" placeholder="Distribuidora Agro S.A." className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">País</label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Email de contacto</label>
                    <input type="email" placeholder="ventas@empresa.com" className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                  </div>
                </div>
              </>
            )}
            {tab === "cotizar" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Descripción del producto</label>
                  <textarea placeholder="Describe el producto o lista que necesitas cotizar..." className="w-full min-h-[80px] px-3 py-2 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Volumen requerido</label>
                    <input type="text" placeholder="Ej: 10,000 kg" className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">País de destino</label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
            {tab === "asesoria" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Cultivo</label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                      <option value="">Seleccionar...</option>
                      {CROPS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">País / Región</label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Problema o consulta</label>
                  <textarea placeholder="Describe el problema que estás observando en tu cultivo..." className="w-full min-h-[80px] px-3 py-2 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-on-surface-variant)]">Teléfono o email</label>
                  <input type="text" placeholder="Para que el asesor te contacte" className="w-full h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                </div>
              </>
            )}
            <button type="submit" className="w-full py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">
              {tab === "comprar" && "Recibir cotizaciones"}
              {tab === "vender" && "Registrar mi empresa"}
              {tab === "cotizar" && "Enviar solicitud de cotización"}
              {tab === "asesoria" && "Solicitar asesor"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
