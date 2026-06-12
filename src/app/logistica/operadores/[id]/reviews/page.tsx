"use client";

import { useParams } from "next/navigation";
import { ChevronLeft, Star, Truck, MapPin, Shield, ThumbsUp, MessageSquare } from "lucide-react";
import Link from "next/link";

const OPERADOR = {
  id: "OP-001",
  nombre: "Transportes Andes S.A.S.",
  nit: "900.123.456-7",
  ciudad: "Bogotá, D.C.",
  cobertura: "Nacional",
  vehiculos: 12,
  conductores: 9,
  aniosOperacion: 8,
  calificacionGlobal: 4.8,
  totalReseñas: 87,
  despachos: 234,
  kmRecorridos: "1.2M",
  puntualidad: 96,
  cargaSegura: 99,
  comunicacion: 95,
  documentacion: 98,
  scoreSeguridad: 98,
  certificaciones: ["INVIMA agroquímicos", "ISO 9001:2015", "BASC Nivel 3"],
};

const DISTRIBUCIONES = [
  { stars: 5, count: 61 },
  { stars: 4, count: 18 },
  { stars: 3, count: 6 },
  { stars: 2, count: 1 },
  { stars: 1, count: 1 },
];

const REVIEWS = [
  {
    id: "R01", empresa: "Grupo Agroindustrial S.A.", contacto: "Mauricio Torres",
    fecha: "2026-05-20", calificacion: 5, ruta: "Bogotá → Valledupar",
    comentario: "Servicio impecable. El conductor llegó puntual, la carga llegó en perfectas condiciones y la comunicación fue excelente durante todo el trayecto.",
    etiquetas: ["Puntual", "Carga segura", "Buena comunicación"],
    utilizado: 12,
  },
  {
    id: "R02", empresa: "Tecnicaña S.A.", contacto: "Luis Giraldo",
    fecha: "2026-05-10", calificacion: 5, ruta: "Bogotá → Cali",
    comentario: "Muy profesionales. El GPS en tiempo real fue muy tranquilizador. Los documentos estaban perfectamente diligenciados.",
    etiquetas: ["GPS activo", "Documentos correctos"],
    utilizado: 8,
  },
  {
    id: "R03", empresa: "AgroValle S.A.S.", contacto: "Patricia Ríos",
    fecha: "2026-04-28", calificacion: 4, ruta: "Medellín → Bucaramanga",
    comentario: "Buen servicio en general. El conductor tuvo una pequeña demora en el primer punto de cargue pero fue resuelto rápidamente.",
    etiquetas: ["Carga segura", "Comunicación oportuna"],
    utilizado: 5,
  },
  {
    id: "R04", empresa: "Cooperativa Boyacá Agro", contacto: "Fernando Niño",
    fecha: "2026-04-12", calificacion: 5, ruta: "Bogotá → Tunja",
    comentario: "Excelente empresa. Ya es la tercera vez que contratamos con ellos y siempre cumplen. Recomendados 100%.",
    etiquetas: ["Recomendado", "Cliente frecuente", "Puntual"],
    utilizado: 3,
  },
  {
    id: "R05", empresa: "Palmas del Norte", contacto: "Andrés Cardenas",
    fecha: "2026-03-25", calificacion: 3, ruta: "Bogotá → Valledupar",
    comentario: "El servicio fue aceptable pero hubo un problema con la documentación del manifiesto que nos retrasó en la aduana. Esperamos mejoría en ese punto.",
    etiquetas: ["Documentación incompleta"],
    utilizado: 1,
  },
];

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size} className={s <= Math.round(n) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
    </div>
  );
}

export default function OperadorReviewsPage() {
  const params = useParams();
  const total = DISTRIBUCIONES.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => history.back()} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold">Reputación del operador</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{OPERADOR.nombre}</p>
        </div>
      </div>

      {/* Perfil operador */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-[var(--color-primary)]">TA</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-bold text-base">{OPERADOR.nombre}</p>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verificado</span>
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">NIT {OPERADOR.nit} · {OPERADOR.ciudad} · {OPERADOR.aniosOperacion} años operando</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[var(--color-on-surface-variant)]">
              <span className="flex items-center gap-1"><Truck size={11} />{OPERADOR.vehiculos} vehículos</span>
              <span className="flex items-center gap-1"><MapPin size={11} />{OPERADOR.cobertura}</span>
              <span>{OPERADOR.despachos} despachos</span>
              <span>{OPERADOR.kmRecorridos} km</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] flex flex-wrap gap-2">
          {OPERADOR.certificaciones.map((c) => (
            <span key={c} className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              <Shield size={9} /> {c}
            </span>
          ))}
        </div>
      </div>

      {/* Puntuaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Calificación global */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4">Calificación global</h2>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-black text-[var(--color-primary)]">{OPERADOR.calificacionGlobal}</p>
              <Stars n={OPERADOR.calificacionGlobal} size={16} />
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">{OPERADOR.totalReseñas} reseñas</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {DISTRIBUCIONES.map((d) => (
                <div key={d.stars} className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--color-on-surface-variant)] w-4 text-right">{d.stars}</span>
                  <Star size={9} className="text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-[var(--color-border-subtle)] rounded-full">
                    <div className="h-1.5 bg-amber-400 rounded-full" style={{ width: `${(d.count / total) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[var(--color-on-surface-variant)] w-5">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores de desempeño */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4">Indicadores de desempeño</h2>
          <div className="space-y-3">
            {[
              { label: "Puntualidad", valor: OPERADOR.puntualidad, color: "bg-green-500" },
              { label: "Carga segura", valor: OPERADOR.cargaSegura, color: "bg-[var(--color-primary)]" },
              { label: "Comunicación", valor: OPERADOR.comunicacion, color: "bg-violet-500" },
              { label: "Documentación", valor: OPERADOR.documentacion, color: "bg-amber-400" },
            ].map((ind) => (
              <div key={ind.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-on-surface-variant)]">{ind.label}</span>
                  <span className="font-semibold">{ind.valor}%</span>
                </div>
                <div className="h-1.5 bg-[var(--color-border-subtle)] rounded-full">
                  <div className={`h-1.5 rounded-full ${ind.color}`} style={{ width: `${ind.valor}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><MessageSquare size={14} />Reseñas recientes</h2>
        <div className="space-y-3">
          {REVIEWS.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-sm">{r.empresa}</p>
                  <p className="text-[11px] text-[var(--color-on-surface-variant)]">{r.contacto} · {r.ruta}</p>
                </div>
                <div className="text-right shrink-0">
                  <Stars n={r.calificacion} size={12} />
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{r.fecha}</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">"{r.comentario}"</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {r.etiquetas.map((e) => (
                    <span key={e} className="text-[10px] bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-full">
                      {e}
                    </span>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-[10px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors shrink-0">
                  <ThumbsUp size={10} /> Útil ({r.utilizado})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button className="text-xs text-[var(--color-primary)] hover:underline">Cargar más reseñas</button>
      </div>
    </div>
  );
}
