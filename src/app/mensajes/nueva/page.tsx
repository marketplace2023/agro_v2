"use client";

import { useState } from "react";
import { MessageSquare, ChevronLeft, Search, X, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TIPOS_CONVERSACION = [
  { valor: "Consulta precompra", desc: "Comprador y vendedor" },
  { valor: "Oportunidad", desc: "Cliente, vendedor y representante" },
  { valor: "RFQ", desc: "Comprador y vendedores invitados" },
  { valor: "Orden", desc: "Comprador, vendedor y soporte" },
  { valor: "Logística", desc: "Comprador, vendedor, almacén y operador" },
  { valor: "Técnica", desc: "Comprador y asesor agronómico" },
  { valor: "Reclamo", desc: "Comprador, vendedor, soporte y logística" },
  { valor: "Interna", desc: "Usuarios de la misma empresa" },
];

const CONTACTOS_DISPONIBLES = [
  { id: "C1", nombre: "Mauricio Torres", empresa: "Grupo Agroindustrial S.A.", rol: "Comprador" },
  { id: "C2", nombre: "Sandra Molina", empresa: "Finca Las Palmas", rol: "Comprador" },
  { id: "C3", nombre: "Ricardo Ospina", empresa: "Cooperativa Boyacá Agro", rol: "Comprador" },
  { id: "C4", nombre: "Juliana Ríos", empresa: "AgroValle S.A.S.", rol: "Comprador" },
  { id: "C5", nombre: "Patricia Suárez", empresa: "Palmas del Norte", rol: "Comprador" },
  { id: "C6", nombre: "Luis Pérez", empresa: "DistAgroMax", rol: "Vendedor" },
  { id: "C7", nombre: "Carlos Díaz", empresa: "DistAgroMax", rol: "Vendedor" },
  { id: "C8", nombre: "Almacén Bogotá", empresa: "DistAgroMax", rol: "Almacén" },
  { id: "C9", nombre: "Soporte", empresa: "Marketplace Agro", rol: "Soporte" },
];

const REFERENCIAS_DISPONIBLES = [
  { tipo: "Orden", id: "ORD-2026-122", desc: "NPK 8t — Grupo Agroindustrial" },
  { tipo: "Orden", id: "ORD-2026-119", desc: "Herbicidas 3t — Tecnicaña" },
  { tipo: "RFQ", id: "RFQ-2024-112", desc: "Fertilizantes complejos 10t" },
  { tipo: "Oportunidad", id: "OPP-2026-031", desc: "Palmas del Norte — NPK 20t" },
  { tipo: "Oportunidad", id: "OPP-2026-034", desc: "Grupo Agroindustrial — Campaña" },
  { tipo: "Reclamo", id: "REC-2026-007", desc: "Producto dañado — Tecnicaña" },
];

export default function NuevaConversacionPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState("");
  const [participantes, setParticipantes] = useState<typeof CONTACTOS_DISPONIBLES>([]);
  const [busquedaPartic, setBusquedaPartic] = useState("");
  const [refSeleccionada, setRefSeleccionada] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensajeInicial, setMensajeInicial] = useState("");

  const disponibles = CONTACTOS_DISPONIBLES.filter(
    (c) =>
      !participantes.find((p) => p.id === c.id) &&
      (c.nombre.toLowerCase().includes(busquedaPartic.toLowerCase()) ||
        c.empresa.toLowerCase().includes(busquedaPartic.toLowerCase())),
  );

  const agregarParticipante = (c: typeof CONTACTOS_DISPONIBLES[0]) => {
    setParticipantes((prev) => [...prev, c]);
    setBusquedaPartic("");
  };

  const quitarParticipante = (id: string) => {
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  };

  const puedeEnviar = tipo && participantes.length > 0 && asunto.trim();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/mensajes" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <MessageSquare size={20} /> Nueva conversación
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Inicia una nueva conversación vinculada a una operación</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 space-y-6">
        {/* Tipo */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">
            Tipo de conversación *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS_CONVERSACION.map((t) => (
              <button
                key={t.valor}
                onClick={() => setTipo(t.valor)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  tipo === t.valor
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-5"
                    : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:border-opacity-40"
                }`}
              >
                <p className={`text-xs font-semibold ${tipo === t.valor ? "text-[var(--color-primary)]" : ""}`}>{t.valor}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Asunto */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">
            Asunto *
          </label>
          <input
            type="text"
            placeholder="Ej: Seguimiento entrega ORD-2026-122..."
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>

        {/* Referencia */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">
            Vincular a (opcional)
          </label>
          <select
            value={refSeleccionada}
            onChange={(e) => setRefSeleccionada(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 bg-white"
          >
            <option value="">Sin vínculo</option>
            {REFERENCIAS_DISPONIBLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.tipo}: {r.id} — {r.desc}
              </option>
            ))}
          </select>
        </div>

        {/* Participantes */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">
            Participantes *
          </label>

          {/* Tags seleccionados */}
          {participantes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {participantes.map((p) => (
                <span key={p.id} className="flex items-center gap-1.5 text-xs bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)] px-2 py-1 rounded-full">
                  {p.nombre}
                  <button onClick={() => quitarParticipante(p.id)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Buscador */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
            <input
              type="text"
              placeholder="Buscar contacto o empresa..."
              value={busquedaPartic}
              onChange={(e) => setBusquedaPartic(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
            />
          </div>
          {busquedaPartic && disponibles.length > 0 && (
            <div className="mt-1 border border-[var(--color-border-subtle)] rounded-lg bg-white shadow-sm overflow-hidden">
              {disponibles.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => agregarParticipante(c)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-surface-container)] transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-[var(--color-primary)]">
                      {c.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">{c.nombre}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{c.empresa} · {c.rol}</p>
                  </div>
                  <Plus size={13} className="ml-auto text-[var(--color-primary)]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mensaje inicial */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">
            Mensaje inicial (opcional)
          </label>
          <textarea
            rows={4}
            placeholder="Escribe el primer mensaje de esta conversación..."
            value={mensajeInicial}
            onChange={(e) => setMensajeInicial(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <Link href="/mensajes" className="flex-1 text-center text-sm border border-[var(--color-border-subtle)] py-2.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Cancelar
          </Link>
          <button
            disabled={!puedeEnviar}
            onClick={() => router.push("/mensajes/CONV-001")}
            className={`flex-1 text-sm py-2.5 rounded-lg font-medium transition-opacity ${
              puedeEnviar
                ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                : "bg-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] cursor-not-allowed"
            }`}
          >
            Iniciar conversación
          </button>
        </div>
      </div>
    </div>
  );
}
