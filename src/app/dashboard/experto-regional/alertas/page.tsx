"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, ChevronDown, Plus, Leaf, Search } from "lucide-react";

type Urgency = "alta" | "media" | "baja";
type DiagStatus = "recibido" | "asignado" | "en_proceso" | "respondido" | "cerrado";

interface Diagnostic {
  id: string;
  cropType: string;
  problemType: string;
  description: string;
  region?: string | null;
  country: string;
  areaHa?: number | null;
  urgency: Urgency;
  status: DiagStatus;
  symptoms: string[];
  diagnosisText?: string | null;
  cause?: string | null;
  createdAt: string;
  buyer: {
    email: string;
    profile?: { firstName: string; lastName: string } | null;
  };
}

const URGENCY_CFG: Record<Urgency, { label: string; color: string; border: string }> = {
  alta:  { label: "Alta",   color: "bg-red-100 text-red-700",       border: "border-red-200" },
  media: { label: "Media",  color: "bg-orange-100 text-orange-700", border: "border-orange-200" },
  baja:  { label: "Baja",   color: "bg-yellow-100 text-yellow-700", border: "border-yellow-200" },
};

const STATUS_CFG: Record<DiagStatus, { label: string; color: string }> = {
  recibido:   { label: "Recibido",    color: "bg-gray-100 text-gray-600" },
  asignado:   { label: "Asignado",    color: "bg-blue-100 text-blue-700" },
  en_proceso: { label: "En proceso",  color: "bg-purple-100 text-purple-700" },
  respondido: { label: "Respondido",  color: "bg-indigo-100 text-indigo-700" },
  cerrado:    { label: "Cerrado",     color: "bg-green-100 text-green-700" },
};

export default function AlertasFitosanitariasPage() {
  const [items, setItems] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("todas");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/experto-regional/alertas")
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((d) => {
    const q = search.toLowerCase();
    const matchQ = !q || d.cropType.toLowerCase().includes(q) || d.problemType.toLowerCase().includes(q) || (d.region ?? "").toLowerCase().includes(q);
    const matchU = filterUrgency === "todas" || d.urgency === filterUrgency;
    const matchS = filterStatus === "todos" || d.status === filterStatus;
    return matchQ && matchU && matchS;
  });

  const counts = {
    alta:    items.filter((d) => d.urgency === "alta").length,
    media:   items.filter((d) => d.urgency === "media").length,
    activas: items.filter((d) => d.status !== "cerrado" && d.status !== "respondido").length,
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Alertas Fitosanitarias</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Diagnósticos agronómicos en tu región</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90">
          <Plus size={15} /> Nueva alerta
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Prioridad alta",  value: counts.alta,    color: "text-red-600" },
          { label: "Prioridad media", value: counts.media,   color: "text-orange-600" },
          { label: "Casos activos",   value: counts.activas, color: "text-[var(--color-primary)]" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cultivo, problema o zona..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
        </div>
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
        >
          <option value="todas">Toda urgencia</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
        >
          <option value="todos">Todos los estados</option>
          <option value="recibido">Recibido</option>
          <option value="asignado">Asignado</option>
          <option value="en_proceso">En proceso</option>
          <option value="respondido">Respondido</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <AlertTriangle size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando alertas...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {filtered.map((d) => {
            const urg = URGENCY_CFG[d.urgency];
            const st  = STATUS_CFG[d.status];
            const isExp = expanded === d.id;
            const buyerName = d.buyer.profile
              ? `${d.buyer.profile.firstName} ${d.buyer.profile.lastName}`
              : d.buyer.email;

            return (
              <div key={d.id} className={`bg-white border rounded-xl overflow-hidden ${urg.border}`}>
                <div
                  className="p-4 cursor-pointer flex items-start justify-between gap-3"
                  onClick={() => setExpanded(isExp ? null : d.id)}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <ChevronDown size={16} className={`mt-0.5 shrink-0 text-[var(--color-on-surface-variant)] transition-transform ${isExp ? "" : "-rotate-90"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{d.problemType}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urg.color}`}>{urg.label}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                        <span className="flex items-center gap-1"><Leaf size={10} /> {d.cropType}</span>
                        {d.region && <span className="flex items-center gap-1"><MapPin size={10} /> {d.region}</span>}
                        {d.areaHa && <span>{d.areaHa} ha</span>}
                        <span>{new Date(d.createdAt).toLocaleDateString("es-CO")}</span>
                        <span>· {buyerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isExp && (
                  <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-3 bg-[var(--color-surface-container-low)]">
                    <p className="text-sm"><span className="font-semibold">Descripción: </span>{d.description}</p>
                    {d.symptoms.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">Síntomas reportados</p>
                        <ul className="flex flex-wrap gap-1.5">
                          {d.symptoms.map((s, i) => (
                            <li key={i} className="text-xs bg-white border border-[var(--color-border-subtle)] px-2 py-0.5 rounded-full">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {d.cause && <p className="text-sm"><span className="font-semibold">Causa identificada: </span>{d.cause}</p>}
                    {d.diagnosisText && <p className="text-sm"><span className="font-semibold">Diagnóstico: </span>{d.diagnosisText}</p>}
                    <div className="flex gap-2 pt-1">
                      <button className="text-xs font-medium bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:opacity-90">
                        Responder
                      </button>
                      <button className="text-xs font-medium border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg hover:bg-gray-50">
                        Notificar asesores
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]">
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No hay alertas en tu región</p>
              <p className="text-xs mt-1">Los diagnósticos agronómicos de tu zona aparecerán aquí</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
