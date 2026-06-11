"use client";

import { useState } from "react";
import {
  RefreshCw, CheckCircle2, AlertCircle, Clock, Zap,
  Database, Settings, ChevronRight, ExternalLink, XCircle,
} from "lucide-react";

const MODULOS = [
  {
    id: "crm", nombre: "CRM — Contactos y empresas", odoo: "Contacts / CRM",
    descripcion: "Sincroniza empresas, contactos, leads y oportunidades con Odoo CRM.",
    estado: "Activa", ultimaSync: "2026-06-11 12:00", registros: 142, errores: 0,
    frecuencia: "Cada 15 min",
  },
  {
    id: "ventas", nombre: "Ventas y cotizaciones", odoo: "Sales / Invoicing",
    descripcion: "Órdenes confirmadas, cotizaciones aceptadas y facturas de venta.",
    estado: "Activa", ultimaSync: "2026-06-11 11:45", registros: 87, errores: 0,
    frecuencia: "Cada 15 min",
  },
  {
    id: "inventario", nombre: "Inventario y entregas", odoo: "Inventory",
    descripcion: "Stock disponible, movimientos y transferencias de almacén.",
    estado: "Con errores", ultimaSync: "2026-06-11 08:30", registros: 34, errores: 3,
    frecuencia: "Cada 30 min",
  },
  {
    id: "flota", nombre: "Flota propia", odoo: "Fleet",
    descripcion: "Vehículos, conductores y programación de despachos.",
    estado: "Activa", ultimaSync: "2026-06-11 10:00", registros: 12, errores: 0,
    frecuencia: "Cada hora",
  },
  {
    id: "contabilidad", nombre: "Contabilidad y pagos", odoo: "Accounting",
    descripcion: "Facturas, cuentas por cobrar/pagar y liquidaciones de flete.",
    estado: "En pausa", ultimaSync: "2026-06-10 18:00", registros: 56, errores: 0,
    frecuencia: "Manual",
  },
  {
    id: "agenda", nombre: "Agenda y actividades CRM", odoo: "Calendar / Activities",
    descripcion: "Actividades, reuniones y seguimiento comercial.",
    estado: "Activa", ultimaSync: "2026-06-11 11:50", registros: 28, errores: 0,
    frecuencia: "Cada 15 min",
  },
];

const LOGS = [
  { hora: "12:00", modulo: "CRM", tipo: "Sync OK", mensaje: "142 contactos sincronizados correctamente." },
  { hora: "11:45", modulo: "Ventas", tipo: "Sync OK", mensaje: "87 órdenes y 12 cotizaciones sincronizadas." },
  { hora: "10:00", modulo: "Flota", tipo: "Sync OK", mensaje: "12 vehículos y 9 conductores actualizados." },
  { hora: "08:30", modulo: "Inventario", tipo: "Error", mensaje: "3 registros rechazados: código de producto no encontrado en Odoo (SKU: FER-0041, FER-0042, HER-0019)." },
  { hora: "07:00", modulo: "Contabilidad", tipo: "Pausa", mensaje: "Sync pausada manualmente por el administrador." },
];

const ESTADO_COLOR: Record<string, string> = {
  Activa: "bg-green-100 text-green-700",
  "Con errores": "bg-red-100 text-red-700",
  "En pausa": "bg-slate-100 text-slate-600",
};

export default function ERPPage() {
  const [conexion] = useState({ url: "https://odoo.marketplace-agro.co", db: "agrov2_prod", usuario: "api@marketplace-agro.co", estado: "Conectado" });
  const [sincronizando, setSincronizando] = useState<string | null>(null);

  function handleSync(id: string) {
    setSincronizando(id);
    setTimeout(() => setSincronizando(null), 1800);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-headline-md font-bold flex items-center gap-2">
          <Database size={22} /> Integración ERP / Odoo
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Configuración y estado de la sincronización con Odoo
        </p>
      </div>

      {/* Conexión */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Zap size={14} />Conexión Odoo</h2>
          <span className="flex items-center gap-1.5 text-[11px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            <CheckCircle2 size={11} /> {conexion.estado}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-[var(--color-on-surface-variant)] mb-0.5">URL Instancia</p>
            <p className="font-medium font-mono text-[var(--color-primary)] flex items-center gap-1">
              {conexion.url}
              <ExternalLink size={9} />
            </p>
          </div>
          <div>
            <p className="text-[var(--color-on-surface-variant)] mb-0.5">Base de datos</p>
            <p className="font-medium font-mono">{conexion.db}</p>
          </div>
          <div>
            <p className="text-[var(--color-on-surface-variant)] mb-0.5">Usuario API</p>
            <p className="font-medium">{conexion.usuario}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex items-center gap-1.5 text-xs border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            <Settings size={12} /> Editar conexión
          </button>
          <button className="flex items-center gap-1.5 text-xs border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            <RefreshCw size={12} /> Probar conexión
          </button>
        </div>
      </div>

      {/* Módulos */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm">Módulos de sincronización</h2>
        {MODULOS.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm">{m.nombre}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[m.estado]}`}>{m.estado}</span>
                  {m.errores > 0 && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{m.errores} error{m.errores !== 1 ? "es" : ""}</span>}
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">{m.descripcion}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--color-on-surface-variant)]">
                  <span className="flex items-center gap-1"><Database size={9} />Odoo: {m.odoo}</span>
                  <span className="flex items-center gap-1"><Clock size={9} />Últ. sync: {m.ultimaSync}</span>
                  <span className="flex items-center gap-1"><RefreshCw size={9} />{m.frecuencia}</span>
                  <span>{m.registros} registros</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleSync(m.id)}
                  disabled={m.estado === "En pausa" || sincronizando === m.id}
                  className="flex items-center gap-1.5 text-xs border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)] disabled:opacity-40"
                >
                  <RefreshCw size={11} className={sincronizando === m.id ? "animate-spin" : ""} />
                  {sincronizando === m.id ? "Sincronizando..." : "Sync ahora"}
                </button>
                <button className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors p-1.5 rounded-lg hover:bg-[var(--color-surface-container)]">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logs recientes */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm">Log de sincronización (hoy)</h2>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {LOGS.map((l, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {l.tipo === "Sync OK" && <CheckCircle2 size={14} className="text-green-500" />}
                {l.tipo === "Error" && <XCircle size={14} className="text-red-500" />}
                {l.tipo === "Pausa" && <AlertCircle size={14} className="text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)]">{l.hora}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${l.tipo === "Error" ? "bg-red-100 text-red-700" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>{l.modulo}</span>
                </div>
                <p className="text-xs">{l.mensaje}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso integración */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
        <p className="font-semibold mb-1">Nota de integración</p>
        <p>La mensajería multiactor y la contratación logística se mantienen como capa propia del Marketplace Agro. Los módulos CRM, ventas, inventario, flota y contabilidad se sincronizan bidireccionalmente con Odoo según las frecuencias configuradas.</p>
      </div>
    </div>
  );
}
