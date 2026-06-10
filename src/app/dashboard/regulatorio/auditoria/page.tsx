"use client";

import { useState } from "react";
import { ClipboardList, User, Shield, Package, Settings } from "lucide-react";

const MOCK_AUDITORIA = [
  { id: "au1", accion: "Documento aprobado", entidad: "Registro ICA — Glifosato 480 SL", usuario: "Ana Regulatoria", fecha: "2026-06-10 09:15", tipo: "regulatorio" },
  { id: "au2", accion: "Producto activado", entidad: "Urea Granulada 46% — DistAgroMax SAS", usuario: "Admin Sistema", fecha: "2026-06-09 16:30", tipo: "producto" },
  { id: "au3", accion: "Alerta emitida", entidad: "Registro SENASICA — Mancozeb 80% WP", usuario: "Ana Regulatoria", fecha: "2026-06-09 11:00", tipo: "regulatorio" },
  { id: "au4", accion: "Usuario creado", entidad: "vendedor@nuevaempresa.com (Vendedor)", usuario: "Admin Sistema", fecha: "2026-06-08 08:45", tipo: "usuario" },
  { id: "au5", accion: "Configuración modificada", entidad: "Comisión fertilizantes: 7% → 8%", usuario: "Admin Sistema", fecha: "2026-06-07 14:20", tipo: "configuracion" },
];

const TIPO_CFG: Record<string, { icon: React.ReactNode; cls: string }> = {
  regulatorio: { icon: <Shield size={13} />, cls: "bg-blue-100 text-blue-700" },
  producto: { icon: <Package size={13} />, cls: "bg-green-100 text-green-700" },
  usuario: { icon: <User size={13} />, cls: "bg-purple-100 text-purple-700" },
  configuracion: { icon: <Settings size={13} />, cls: "bg-gray-100 text-gray-700" },
};

export default function AuditoriaPage() {
  const [items] = useState(MOCK_AUDITORIA);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Log de auditoría</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">Registro de todas las acciones críticas del sistema</p>
      </div>
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Tipo", "Acción", "Entidad afectada", "Usuario", "Fecha"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {items.map(item => {
              const tcfg = TIPO_CFG[item.tipo];
              return (
                <tr key={item.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${tcfg.cls}`}>
                      {tcfg.icon} {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{item.accion}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)] max-w-xs truncate">{item.entidad}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5"><User size={11} /> {item.usuario}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.fecha}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
