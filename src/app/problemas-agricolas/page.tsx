"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";

const CROPS = ["Maíz", "Café", "Tomate", "Papa", "Banano", "Aguacate", "Arroz", "Soya", "Cacao", "Cítricos", "Hortalizas", "Caña de azúcar"];

const PROBLEM_TYPES = [
  { value: "nutricional", label: "Deficiencia nutricional", emoji: "🌿" },
  { value: "plaga", label: "Plaga (insecto, ácaro, nematodo)", emoji: "🐛" },
  { value: "enfermedad", label: "Enfermedad (hongo, bacteria, virus)", emoji: "🍄" },
  { value: "maleza", label: "Maleza", emoji: "🌾" },
  { value: "abiotico", label: "Estrés abiótico (sequía, calor, salinidad)", emoji: "🌡️" },
];

const DIAGNOSES: Record<string, {
  title: string; description: string;
  products: { name: string; slug: string; type: string }[];
}[]> = {
  "nutricional-Maíz": [
    { title: "Deficiencia de nitrógeno", description: "Hojas amarillentas desde las más viejas, crecimiento lento. La planta no tiene suficiente nitrógeno disponible.", products: [{ name: "Urea 46%", slug: "urea-granulada-46-nitrogeno", type: "Fertilizante" }, { name: "Nitrato de amonio", slug: "nitrato-amonio", type: "Fertilizante" }] },
    { title: "Deficiencia de zinc", description: "Rayas blancas o amarillas en hojas jóvenes. Las hojas emergentes son pequeñas y arrugadas.", products: [{ name: "Sulfato de zinc", slug: "sulfato-zinc-foliar", type: "Micronutriente" }] },
  ],
  "plaga-Tomate": [
    { title: "Mosca blanca (Bemisia tabaci)", description: "Presencia de insectos blancos pequeños en el envés. Hojas amarillas, fumagina negra.", products: [{ name: "Imidacloprid 350 SC", slug: "imidacloprid-350-sc", type: "Insecticida" }, { name: "Spinosad (bio)", slug: "spinosad-biologico", type: "Biológico" }] },
    { title: "Trips (Frankliniella)", description: "Raspaduras plateadas en hojas y frutos. Transmite TSWV.", products: [{ name: "Abamectina 1.8 EC", slug: "abamectina-18-ec", type: "Insecticida" }] },
  ],
};

export default function ProblemasAgricolasPage() {
  const [problemType, setProblemType] = useState("");
  const [crop, setCrop] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [results, setResults] = useState<typeof DIAGNOSES[string] | null>(null);

  function handleDiagnose(e: React.FormEvent) {
    e.preventDefault();
    const key = `${problemType}-${crop}`;
    const found = DIAGNOSES[key] ?? [];
    setResults(
      found.length > 0 ? found : [
        {
          title: "Consulta con un experto",
          description: `No encontramos un diagnóstico automático para "${symptoms}" en ${crop || "tu cultivo"}. Te recomendamos consultar con un asesor agronómico para un diagnóstico preciso.`,
          products: [],
        },
      ]
    );
  }

  return (
    <div className="container-max py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Diagnóstico de problemas agrícolas</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Describe el problema y encuentra el tratamiento adecuado con productos del catálogo
        </p>
      </div>

      <form onSubmit={handleDiagnose} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 space-y-5">
        {/* Step 1 */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--color-on-surface)]">1. ¿Qué tipo de problema tienes?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROBLEM_TYPES.map((pt) => (
              <label key={pt.value}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${problemType === pt.value ? "border-[var(--color-primary)] bg-[var(--color-surface-container-low)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
                <input type="radio" name="problemType" value={pt.value} checked={problemType === pt.value}
                  onChange={(e) => setProblemType(e.target.value)} className="sr-only" />
                <span>{pt.emoji}</span>
                <span className="text-sm">{pt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[var(--color-on-surface)]">2. ¿En qué cultivo?</label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)}
            className="h-10 w-full px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
            <option value="">Seleccionar cultivo...</option>
            {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Step 3 */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[var(--color-on-surface)]">3. ¿Cuál es el síntoma principal?</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe lo que observas: color de hojas, manchas, insectos, deformaciones, etc."
            className="w-full min-h-[80px] px-3 py-2 rounded-md border border-[var(--color-border-subtle)] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        <button type="submit"
          className="w-full py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">
          🔍 Diagnosticar
        </button>
      </form>

      {/* Results */}
      {results && (
        <div className="mt-6 space-y-4">
          <h2 className="font-semibold text-[var(--color-on-surface)]">Resultados del diagnóstico</h2>
          {results.map((result, i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
              <h3 className="font-semibold text-[var(--color-on-surface)] mb-1">{result.title}</h3>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-3">{result.description}</p>
              {result.products.length > 0 && (
                <>
                  <p className="text-xs font-medium text-[var(--color-on-surface)] mb-2">Productos recomendados:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.products.map((p) => (
                      <Link key={p.slug} href={`/productos/${p.slug}`}
                        className="flex items-center gap-1.5 text-xs bg-[var(--color-surface-container)] hover:bg-[var(--color-primary)] hover:text-white px-3 py-1.5 rounded-lg border border-[var(--color-border-subtle)] transition-colors">
                        🌱 {p.name}
                        <span className="text-[var(--color-on-surface-variant)]">· {p.type}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)]">
                <Link href="/asesoria-agronomica"
                  className="text-sm text-[var(--color-primary)] hover:underline">
                  📋 Solicitar diagnóstico profesional con un experto →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
