"use client";

import { useState } from "react";
import { UserCircle2, Search, Phone, Mail, Building2, Plus, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";

const CONTACTOS = [
  { id: "CON-001", nombre: "Mauricio Torres", cargo: "Gerente de Compras", empresa: "Grupo Agroindustrial S.A.", empresaId: "EMP-001", telefono: "+57 310 123 4567", email: "m.torres@grupoagro.com", pais: "Colombia", estado: "Activo", ultimoContacto: "2026-06-10" },
  { id: "CON-002", nombre: "Sandra Molina", cargo: "Administradora", empresa: "Finca Las Palmas", empresaId: "EMP-002", telefono: "+57 315 987 6543", email: "smolina@palmas.co", pais: "Colombia", estado: "Activo", ultimoContacto: "2026-06-08" },
  { id: "CON-003", nombre: "Ricardo Ospina", cargo: "Director Técnico", empresa: "Cooperativa Boyacá Agro", empresaId: "EMP-003", telefono: "+57 320 456 7890", email: "r.ospina@coopboyaca.co", pais: "Colombia", estado: "Activo", ultimoContacto: "2026-06-05" },
  { id: "CON-004", nombre: "Juliana Ríos", cargo: "Coordinadora Agrícola", empresa: "AgroValle S.A.S.", empresaId: "EMP-005", telefono: "+57 312 234 5678", email: "jrios@agrovalle.com", pais: "Colombia", estado: "Activo", ultimoContacto: "2026-06-09" },
  { id: "CON-005", nombre: "Carlos Herrera", cargo: "Comprador", empresa: "Tecnicaña S.A.", empresaId: "EMP-004", telefono: "+57 317 345 6789", email: "cherrera@tecnicana.com", pais: "Colombia", estado: "Activo", ultimoContacto: "2026-06-03" },
  { id: "CON-006", nombre: "Patricia Suárez", cargo: "Gerente General", empresa: "Palmas del Norte", empresaId: "EMP-006", telefono: "+57 321 876 5432", email: "psuarez@palmasnorte.co", pais: "Colombia", estado: "Activo", ultimoContacto: "2026-06-01" },
  { id: "CON-007", nombre: "Diego Morales", cargo: "Encargado de Logística", empresa: "Agrícola del Llano", empresaId: "EMP-007", telefono: "+57 314 654 3210", email: "dmorales@agrollano.co", pais: "Colombia", estado: "Prospecto", ultimoContacto: "2026-05-28" },
  { id: "CON-008", nombre: "Ana Ramírez", cargo: "Asistente Comercial", empresa: "Grupo Agroindustrial S.A.", empresaId: "EMP-001", telefono: "+57 311 111 2222", email: "aramirez@grupoagro.com", pais: "Colombia", estado: "Activo", ultimoContacto: "2026-06-07" },
];

const ESTADO_COLOR: Record<string, string> = {
  Activo: "bg-green-100 text-green-700",
  Prospecto: "bg-amber-100 text-amber-700",
  Inactivo: "bg-slate-100 text-slate-600",
};

export default function ContactosPage() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = CONTACTOS.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.cargo.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <UserCircle2 size={22} /> Contactos
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{CONTACTOS.length} contactos registrados</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nuevo contacto
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por nombre, empresa o cargo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <button className="flex items-center gap-2 text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
          <Filter size={14} /> Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtrados.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[var(--color-primary)]">
                  {c.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[c.estado]}`}>
                {c.estado}
              </span>
            </div>
            <p className="text-sm font-semibold truncate">{c.nombre}</p>
            <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{c.cargo}</p>
            <Link
              href={`/crm/clientes/${c.empresaId}/historial`}
              className="flex items-center gap-1 text-[11px] text-[var(--color-primary)] mt-1 hover:underline"
            >
              <Building2 size={10} /> {c.empresa}
            </Link>
            <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] space-y-1.5">
              <a href={`tel:${c.telefono}`} className="flex items-center gap-2 text-[11px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
                <Phone size={11} className="shrink-0" /> {c.telefono}
              </a>
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-[11px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors truncate">
                <Mail size={11} className="shrink-0" /> {c.email}
              </a>
            </div>
            <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-2">
              Último contacto: {c.ultimoContacto}
            </p>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-[var(--color-on-surface-variant)]">
            No se encontraron contactos
          </div>
        )}
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/empresas" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <Building2 size={11} /> Ver empresas
        </Link>
        <Link href="/crm/leads" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <ChevronRight size={11} /> Ver leads
        </Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
