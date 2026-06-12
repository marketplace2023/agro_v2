"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft, Send, Paperclip, Users, FolderOpen, CheckSquare,
  MoreHorizontal, Circle, Lock, ExternalLink,
} from "lucide-react";
import Link from "next/link";

const CONVERSACION = {
  id: "CONV-001",
  titulo: "Orden NPK 8t — Grupo Agroindustrial",
  tipo: "Orden",
  ref: "ORD-2026-122",
  estado: "Abierta",
  participantes: [
    { nombre: "Mauricio Torres", empresa: "Grupo Agroindustrial S.A.", rol: "Comprador", avatar: "MT", propio: false },
    { nombre: "María Gómez", empresa: "DistAgroMax", rol: "Vendedor", avatar: "MG", propio: true },
    { nombre: "Almacén Bogotá", empresa: "DistAgroMax", rol: "Almacén", avatar: "AB", propio: true },
  ],
};

const MENSAJES = [
  { id: 1, autor: "Mauricio Torres", avatar: "MT", propio: false, fecha: "2026-06-10 09:15", texto: "Buenos días. Quiero confirmar el estado del pedido ORD-2026-122. ¿Ya está listo para despacho?", tipo: "texto", leido: true },
  { id: 2, autor: "María Gómez", avatar: "MG", propio: true, fecha: "2026-06-10 09:32", texto: "Buenos días Mauricio. Sí, el pedido está completo en bodega. Estamos coordinando el despacho para el lunes 14 de junio.", tipo: "texto", leido: true },
  { id: 3, autor: "María Gómez", avatar: "MG", propio: true, fecha: "2026-06-10 09:33", texto: "Le adjunto la nota de remisión.", tipo: "archivo", archivo: { nombre: "Remision_ORD-2026-122.pdf", peso: "148 KB" }, leido: true },
  { id: 4, autor: "Mauricio Torres", avatar: "MT", propio: false, fecha: "2026-06-10 10:05", texto: "Perfecto. ¿A qué hora llegaría el camión? Necesitamos coordinar con el almacén para recibir.", tipo: "texto", leido: true },
  { id: 5, autor: "Almacén Bogotá", avatar: "AB", propio: true, fecha: "2026-06-10 10:20", texto: "El camión sale a las 5am desde Bogotá. Estimado de llegada a Valledupar: entre 2pm y 3pm del lunes.", tipo: "texto", leido: true },
  { id: 6, autor: "Mauricio Torres", avatar: "MT", propio: false, fecha: "2026-06-11 08:45", texto: "Perfecto, confirmamos el despacho para el lunes. El encargado de recibo es don Jorge, cel. 310-000-1234.", tipo: "texto", leido: false },
  { id: 7, autor: "Mauricio Torres", avatar: "MT", propio: false, fecha: "2026-06-11 08:46", texto: "¿Pueden confirmarme el número de guía de transporte cuando esté disponible?", tipo: "texto", leido: false },
];

const NOTAS_PRIVADAS = [
  { texto: "Cliente exige embalaje reforzado. Recordar al almacén.", autor: "María Gómez", fecha: "2026-06-10" },
];

export default function ConversacionPage() {
  const params = useParams();
  const [texto, setTexto] = useState("");
  const [notaPrivada, setNotaPrivada] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border-subtle)]">
        <Link href="/mensajes" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors shrink-0">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm font-bold truncate">{CONVERSACION.titulo}</h1>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium shrink-0">
              {CONVERSACION.tipo}
            </span>
            <Link href="#" className="text-[10px] text-[var(--color-primary)] hover:underline flex items-center gap-0.5 shrink-0">
              {CONVERSACION.ref} <ExternalLink size={9} />
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
              <Circle size={7} className="fill-current" /> {CONVERSACION.estado}
            </span>
            <span className="text-[10px] text-[var(--color-on-surface-variant)]">
              {CONVERSACION.participantes.length} participantes
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Link href={`/mensajes/${params.id}/participantes`} className="p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]" title="Participantes">
            <Users size={16} />
          </Link>
          <Link href={`/mensajes/${params.id}/archivos`} className="p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]" title="Archivos">
            <FolderOpen size={16} />
          </Link>
          <Link href={`/mensajes/${params.id}/tareas`} className="p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]" title="Tareas">
            <CheckSquare size={16} />
          </Link>
          <button className="p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {/* Nota privada */}
        {NOTAS_PRIVADAS.map((n, i) => (
          <div key={i} className="flex justify-center">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 max-w-md text-center">
              <div className="flex items-center gap-1 justify-center text-amber-700 mb-1">
                <Lock size={11} />
                <span className="text-[10px] font-semibold uppercase">Nota privada</span>
              </div>
              <p className="text-xs text-amber-800">{n.texto}</p>
              <p className="text-[9px] text-amber-600 mt-0.5">{n.autor} · {n.fecha}</p>
            </div>
          </div>
        ))}

        {MENSAJES.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.propio ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0 self-end">
              <span className="text-[10px] font-bold text-[var(--color-primary)]">{m.avatar}</span>
            </div>

            <div className={`max-w-[70%] ${m.propio ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {/* Nombre + hora */}
              <div className={`flex items-center gap-2 ${m.propio ? "flex-row-reverse" : ""}`}>
                <span className="text-[10px] font-semibold text-[var(--color-on-surface)]">{m.autor}</span>
                <span className="text-[9px] text-[var(--color-on-surface-variant)]">{m.fecha.split(" ")[1]}</span>
                {!m.leido && !m.propio && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                )}
              </div>

              {/* Burbuja */}
              {m.tipo === "texto" ? (
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  m.propio
                    ? "bg-[var(--color-primary)] text-white rounded-tr-sm"
                    : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface)] rounded-tl-sm"
                }`}>
                  {m.texto}
                </div>
              ) : (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
                  m.propio
                    ? "bg-[var(--color-primary)] bg-opacity-10 border-[var(--color-primary)] border-opacity-30 rounded-tr-sm"
                    : "bg-white border-[var(--color-border-subtle)] rounded-tl-sm"
                }`}>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-red-600">PDF</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">{m.archivo?.nombre}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{m.archivo?.peso}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border-subtle)] pt-4">
        {/* Toggle nota privada */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setNotaPrivada(false)}
            className={`text-xs px-3 py-1 rounded-lg transition-colors ${!notaPrivada ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-on-surface-variant)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container)]"}`}
          >
            Mensaje
          </button>
          <button
            onClick={() => setNotaPrivada(true)}
            className={`text-xs px-3 py-1 rounded-lg flex items-center gap-1 transition-colors ${notaPrivada ? "bg-amber-500 text-white" : "text-[var(--color-on-surface-variant)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container)]"}`}
          >
            <Lock size={11} /> Nota privada
          </button>
        </div>

        <div className={`flex items-end gap-3 p-3 rounded-xl border ${notaPrivada ? "border-amber-300 bg-amber-50" : "border-[var(--color-border-subtle)] bg-white"}`}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={notaPrivada ? "Nota interna (no visible para clientes externos)..." : "Escribe un mensaje..."}
            className="flex-1 text-sm resize-none focus:outline-none bg-transparent min-h-[40px] max-h-32"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setTexto("");
              }
            }}
          />
          <div className="flex items-center gap-2 shrink-0">
            <button className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
              <Paperclip size={16} />
            </button>
            <button
              disabled={!texto.trim()}
              className={`p-2 rounded-lg transition-colors ${texto.trim() ? "bg-[var(--color-primary)] text-white hover:opacity-90" : "text-[var(--color-border-subtle)] cursor-not-allowed"}`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1.5">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
