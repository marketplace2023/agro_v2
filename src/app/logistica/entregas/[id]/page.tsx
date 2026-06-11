"use client";

import { useParams } from "next/navigation";
import {
  ChevronLeft, CheckCircle2, Package, Truck, MapPin,
  Clock, User, Camera, FileSignature, AlertCircle, Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ENTREGA = {
  id: "RET-001",
  orden: "ORD-2026-122",
  operador: "Transportes Andes S.A.S.",
  conductor: "Pedro Morales",
  placa: "XYZ-123",
  origen: "Bodega DistAgroMax, Bogotá",
  destino: "Finca Palmas del Norte, Valledupar",
  empresa: "Grupo Agroindustrial S.A.",
  contactoDestino: "Mauricio Torres",
  fechaEntregaEst: "2026-06-15",
  fechaEntregaReal: "2026-06-15",
  horaEntrega: "14:32",
  pesoKg: "10,000 kg",
  bultos: "200 sacos",
  bultosDespachados: 200,
  documentos: [
    { nombre: "Remisión firmada", estado: "Pendiente firma" },
    { nombre: "Manifiesto de carga", estado: "Verificado" },
    { nombre: "Foto de evidencia entrega", estado: "Pendiente" },
    { nombre: "Acta de recepción conforme", estado: "Pendiente" },
  ],
};

export default function EntregaPage() {
  useParams();
  const [bultosRecibidos, setBultosRecibidos] = useState(ENTREGA.bultosDespachados);
  const [novedad, setNovedad] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [confirmado, setConfirmado] = useState(false);

  const conforme = bultosRecibidos === ENTREGA.bultosDespachados && !novedad;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href={`/tracking/${ENTREGA.id}`} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Package size={20} /> Prueba de entrega
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            {ENTREGA.id} · Orden {ENTREGA.orden}
          </p>
        </div>
        {confirmado ? (
          <span className="text-[11px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium shrink-0">Entrega confirmada</span>
        ) : (
          <span className="text-[11px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium shrink-0">Pendiente confirmación</span>
        )}
      </div>

      {confirmado && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Entrega confirmada exitosamente</p>
            <p className="text-xs text-green-700 mt-0.5">El operador ha sido notificado. La liquidación se procesará en las próximas 24 horas.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Resumen del despacho */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Resumen del despacho</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <Truck size={13} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Operador</p><p className="font-medium">{ENTREGA.operador}</p><p className="text-[var(--color-on-surface-variant)] font-mono">{ENTREGA.placa}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <User size={13} className="text-[var(--color-on-surface-variant)] shrink-0 mt-0.5" />
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Conductor</p><p className="font-medium">{ENTREGA.conductor}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Origen</p><p className="font-medium">{ENTREGA.origen}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-green-500 shrink-0 mt-0.5" />
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Destino</p><p className="font-medium">{ENTREGA.destino}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={13} className="text-[var(--color-on-surface-variant)] shrink-0 mt-0.5" />
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Hora llegada</p><p className="font-medium">{ENTREGA.fechaEntregaReal} {ENTREGA.horaEntrega}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <Package size={13} className="text-[var(--color-on-surface-variant)] shrink-0 mt-0.5" />
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Carga</p><p className="font-medium">{ENTREGA.pesoKg} · {ENTREGA.bultos}</p></div>
              </div>
            </div>
          </div>

          {/* Conteo físico */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Verificación de carga recibida</h2>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="text-xs text-[var(--color-on-surface-variant)] mb-1.5 block">
                  Bultos recibidos (despachados: {ENTREGA.bultosDespachados})
                </label>
                <input
                  type="number"
                  min={0}
                  max={ENTREGA.bultosDespachados}
                  value={bultosRecibidos}
                  onChange={(e) => setBultosRecibidos(Number(e.target.value))}
                  disabled={confirmado}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 disabled:opacity-50"
                />
              </div>
              <div className={`text-center px-4 py-2 rounded-xl text-sm font-bold shrink-0 ${bultosRecibidos === ENTREGA.bultosDespachados ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {bultosRecibidos === ENTREGA.bultosDespachados ? "✓ Conforme" : `${ENTREGA.bultosDespachados - bultosRecibidos} faltantes`}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-[var(--color-on-surface-variant)] mb-1.5 block">
                Novedades o daños observados (opcional)
              </label>
              <textarea
                rows={3}
                value={novedad}
                onChange={(e) => setNovedad(e.target.value)}
                disabled={confirmado}
                placeholder="Ej: 2 sacos con rotura en la costura, humedad en 5 bultos..."
                className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Documentos */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
              <h2 className="font-semibold text-sm">Documentos de entrega</h2>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {ENTREGA.documentos.map((d, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs">{d.nombre}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${d.estado === "Verificado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {d.estado}
                    </span>
                    {d.estado !== "Verificado" && !confirmado && (
                      <button className="flex items-center gap-1 text-[10px] text-[var(--color-primary)] border border-[var(--color-primary)] border-opacity-30 px-2 py-0.5 rounded-full hover:bg-blue-50 transition-colors">
                        {d.nombre.includes("Foto") ? <Camera size={9} /> : <FileSignature size={9} />}
                        Subir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calificación */}
          {!confirmado && (
            <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
              <h2 className="font-semibold text-sm mb-3">Calificar servicio (opcional)</h2>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} onClick={() => setCalificacion(s)} className="transition-transform hover:scale-110">
                    <Star size={28} className={s <= calificacion ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                  </button>
                ))}
                {calificacion > 0 && <span className="text-sm text-[var(--color-on-surface-variant)] ml-2">{["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"][calificacion]}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Receptor</h2>
            <p className="text-sm font-medium">{ENTREGA.contactoDestino}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{ENTREGA.empresa}</p>
          </div>

          {!conforme && !confirmado && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Hay diferencias en la carga. Se abrirá una incidencia automáticamente al confirmar.
              </p>
            </div>
          )}

          <button
            onClick={() => setConfirmado(true)}
            disabled={confirmado}
            className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            {confirmado ? "Entrega confirmada" : conforme ? "Confirmar entrega conforme" : "Confirmar con novedad"}
          </button>

          {confirmado && (
            <Link href="/logistica/liquidaciones" className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors">
              Ver liquidación →
            </Link>
          )}

          {!confirmado && (
            <Link href="/logistica/incidencias" className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors">
              <AlertCircle size={14} /> Reportar incidencia
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
