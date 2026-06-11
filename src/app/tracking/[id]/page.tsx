"use client";

import { useParams } from "next/navigation";
import {
  ChevronLeft, Package, Truck, CheckCircle, MapPin, Clock,
  AlertCircle, Phone, Thermometer, Navigation, RefreshCw,
} from "lucide-react";
import Link from "next/link";

type TrackStatus = "procesando" | "en_preparacion" | "despachado" | "en_transito" | "en_entrega" | "entregado" | "incidencia";

const ENVIOS: Record<string, {
  id: string; orden: string; operador: string; conductor: string; conductorTel: string;
  placa: string; origen: string; destino: string; destinatario: string;
  fechaSalida: string; fechaEntregaEst: string; estado: TrackStatus;
  lat: string; lon: string; velocidad: string; ultimaActualizacion: string;
  temperatura: string; peso: string; bultos: string;
  eventos: { estado: TrackStatus; descripcion: string; ubicacion: string; hora: string }[];
}> = {
  "RET-001": {
    id: "RET-001", orden: "ORD-2026-122", operador: "Transportes Andes S.A.S.",
    conductor: "Pedro Morales", conductorTel: "+57 311 500 6699",
    placa: "XYZ-123", origen: "Bodega DistAgroMax, Bogotá",
    destino: "Finca Palmas del Norte, Valledupar",
    destinatario: "Mauricio Torres — Grupo Agroindustrial S.A.",
    fechaSalida: "2026-06-14 05:00", fechaEntregaEst: "2026-06-15",
    estado: "en_transito",
    lat: "6.744°N", lon: "73.052°W", velocidad: "78 km/h",
    ultimaActualizacion: "2026-06-14 12:43",
    temperatura: "Ambiente (24°C)", peso: "10 t", bultos: "200 sacos",
    eventos: [
      { estado: "procesando", descripcion: "Reserva confirmada, operador notificado", ubicacion: "Bogotá, D.C.", hora: "2026-06-13 17:00" },
      { estado: "en_preparacion", descripcion: "Conductor llega a bodega para cargue", ubicacion: "Bodega DistAgroMax, Bogotá", hora: "2026-06-14 04:50" },
      { estado: "despachado", descripcion: "Cargue completado, documentos verificados", ubicacion: "Calle 80 #68D-35, Bogotá", hora: "2026-06-14 06:15" },
      { estado: "en_transito", descripcion: "En tránsito por ruta nacional", ubicacion: "Autopista Bogotá–Bucaramanga, Km 195", hora: "2026-06-14 12:43" },
    ],
  },
  "TRK-2026-AGR-00891": {
    id: "TRK-2026-AGR-00891", orden: "ORD-2026-4521", operador: "LogiAgro Express",
    conductor: "Jorge Mena", conductorTel: "+57 311 100 2233",
    placa: "UVW-456", origen: "Zona Industrial Bogotá",
    destino: "Km 12 Vía Palmira, Valle del Cauca",
    destinatario: "Jorge Martínez — Hacienda El Palmar SAS",
    fechaSalida: "2026-06-10 15:45", fechaEntregaEst: "2026-06-12",
    estado: "en_transito",
    lat: "4.231°N", lon: "75.112°W", velocidad: "65 km/h",
    ultimaActualizacion: "2026-06-11 08:22",
    temperatura: "Ambiente (22°C)", peso: "6 t", bultos: "120 unidades",
    eventos: [
      { estado: "procesando", descripcion: "Orden confirmada y en espera de despacho", ubicacion: "Bogotá, D.C.", hora: "2026-06-10 09:00" },
      { estado: "en_preparacion", descripcion: "Pedido siendo preparado en bodega", ubicacion: "Zona Industrial Bogotá", hora: "2026-06-10 11:30" },
      { estado: "despachado", descripcion: "Pedido recogido por LogiAgro Express", ubicacion: "Zona Industrial Bogotá", hora: "2026-06-10 15:45" },
      { estado: "en_transito", descripcion: "En tránsito hacia punto de entrega", ubicacion: "Autopista Sur Km 48, Cundinamarca", hora: "2026-06-11 08:22" },
    ],
  },
};

const STATUS_CFG: Record<TrackStatus, { label: string; color: string; bg: string }> = {
  procesando: { label: "Procesando", color: "text-slate-500", bg: "bg-slate-100" },
  en_preparacion: { label: "Preparando", color: "text-blue-500", bg: "bg-blue-50" },
  despachado: { label: "Despachado", color: "text-violet-600", bg: "bg-violet-50" },
  en_transito: { label: "En tránsito", color: "text-amber-600", bg: "bg-amber-50" },
  en_entrega: { label: "En entrega", color: "text-blue-700", bg: "bg-blue-100" },
  entregado: { label: "Entregado", color: "text-green-600", bg: "bg-green-100" },
  incidencia: { label: "Incidencia", color: "text-red-600", bg: "bg-red-100" },
};

const PASOS: TrackStatus[] = ["procesando", "en_preparacion", "despachado", "en_transito", "en_entrega", "entregado"];

const ICONOS: Record<TrackStatus, React.ReactNode> = {
  procesando: <Package size={13} />,
  en_preparacion: <Package size={13} />,
  despachado: <Truck size={13} />,
  en_transito: <Truck size={13} />,
  en_entrega: <Navigation size={13} />,
  entregado: <CheckCircle size={13} />,
  incidencia: <AlertCircle size={13} />,
};

export default function TrackingDynamicPage() {
  const params = useParams();
  const envio = ENVIOS[params.id as string] ?? ENVIOS["RET-001"];
  const stepIdx = PASOS.indexOf(envio.estado);
  const cfg = STATUS_CFG[envio.estado];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => history.back()} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Truck size={20} /> Tracking en vivo
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] font-mono mt-0.5">{envio.id} · {envio.orden}</p>
        </div>
        <span className={`text-[11px] px-3 py-1 rounded-full font-medium shrink-0 ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <div className="flex items-start overflow-x-auto pb-2 gap-0">
          {PASOS.map((p, i) => {
            const done = i <= stepIdx;
            const active = i === stepIdx;
            const pc = STATUS_CFG[p];
            return (
              <div key={p} className="flex items-center shrink-0">
                <div className="flex flex-col items-center w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${active ? `${pc.bg} ${pc.color} ring-4 ring-current ring-opacity-20` : done ? "bg-green-100 text-green-600" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
                    {done && !active ? <CheckCircle size={13} /> : ICONOS[p]}
                  </div>
                  <p className={`text-[10px] font-medium text-center mt-1 leading-tight w-16 ${active ? pc.color : done ? "text-green-600" : "text-[var(--color-on-surface-variant)]"}`}>
                    {STATUS_CFG[p].label}
                  </p>
                </div>
                {i < PASOS.length - 1 && (
                  <div className={`h-0.5 w-8 mx-1 shrink-0 ${i < stepIdx ? "bg-green-400" : "bg-[var(--color-border-subtle)]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Posición GPS */}
          <div className={`${cfg.bg} rounded-xl border border-current border-opacity-20 p-4`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`font-semibold text-sm flex items-center gap-2 ${cfg.color}`}>
                <Navigation size={15} /> Posición actual
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-[var(--color-on-surface-variant)]">
                <RefreshCw size={10} /> Act. {envio.ultimaActualizacion}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Latitud</p><p className="font-mono font-medium">{envio.lat}</p></div>
              <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Longitud</p><p className="font-mono font-medium">{envio.lon}</p></div>
              <div><p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Truck size={9} />Velocidad</p><p className="font-medium">{envio.velocidad}</p></div>
            </div>
            <div className="mt-3 h-32 bg-white rounded-lg flex items-center justify-center border border-current border-opacity-10">
              <div className="text-center text-xs text-[var(--color-on-surface-variant)]">
                <MapPin size={24} className={`mx-auto mb-1 ${cfg.color}`} />
                <p>Mapa GPS en tiempo real</p>
                <p className="text-[10px] opacity-70">Integración próximamente</p>
              </div>
            </div>
          </div>

          {/* Ruta */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Ruta del envío</h2>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                <div className="w-0.5 flex-1 bg-[var(--color-border-subtle)] my-1 min-h-[40px]" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 space-y-5">
                <div>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">Origen</p>
                  <p className="text-sm font-medium">{envio.origen}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">Salida: {envio.fechaSalida}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">Destino</p>
                  <p className="text-sm font-medium">{envio.destino}</p>
                  <p className="text-[10px] text-green-600">Entrega est.: {envio.fechaEntregaEst}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
              <h2 className="font-semibold text-sm flex items-center gap-2"><Clock size={14} />Historial de eventos</h2>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {[...envio.eventos].reverse().map((ev, i) => {
                const evc = STATUS_CFG[ev.estado];
                return (
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${i === 0 ? evc.bg : "bg-[var(--color-surface-container)]"}`}>
                      <span className={i === 0 ? evc.color : "text-[var(--color-on-surface-variant)]"}>
                        {ICONOS[ev.estado]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${i === 0 ? evc.color : ""}`}>{ev.descripcion}</p>
                      <div className="flex gap-3 text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">
                        <span className="flex items-center gap-0.5"><MapPin size={9} />{ev.ubicacion}</span>
                        <span className="flex items-center gap-0.5"><Clock size={9} />{ev.hora}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Conductor</h2>
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center mb-2">
              <span className="text-sm font-bold text-[var(--color-primary)]">
                {envio.conductor.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <p className="font-medium text-sm">{envio.conductor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">{envio.operador}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] font-mono mb-3">{envio.placa}</p>
            <a href={`tel:${envio.conductorTel}`} className="flex items-center gap-2 text-xs text-[var(--color-primary)] hover:underline">
              <Phone size={12} /> {envio.conductorTel}
            </a>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Carga</h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Peso</span><span className="font-medium">{envio.peso}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Bultos</span><span className="font-medium">{envio.bultos}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-on-surface-variant)] flex items-center gap-1"><Thermometer size={10} />Temperatura</span>
                <span className="font-medium">{envio.temperatura}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-2">Destinatario</h2>
            <p className="text-xs">{envio.destinatario}</p>
          </div>

          <Link
            href={`/logistica/entregas/${envio.id}`}
            className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] rounded-xl text-sm hover:bg-[var(--color-surface-container)] transition-colors"
          >
            <CheckCircle size={14} /> Confirmar entrega
          </Link>

          <Link
            href="/logistica/incidencias"
            className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            <AlertCircle size={14} /> Reportar incidencia
          </Link>
        </div>
      </div>
    </div>
  );
}
