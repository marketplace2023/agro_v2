"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ChevronDown, ChevronUp, Clock } from "lucide-react";

interface AuditLog {
  id: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  userRole: string;
  ipAddress: string | null;
  userAgent: string | null;
  fieldsBefore: Record<string, unknown> | null;
  fieldsAfter: Record<string, unknown> | null;
  comment: string | null;
  createdAt: string;
  user: {
    email: string;
    profile: { firstName: string; lastName: string } | null;
  };
}

const MODULES = ["", "Regulatorio", "Documentos", "Órdenes", "Pagos", "Usuarios", "Productos", "B2B", "Admin"];
const ACTION_MAP: Record<string, string> = {
  aprobar_registro: "bg-green-100 text-green-700",
  rechazar_registro: "bg-red-100 text-red-700",
  rechazar_producto: "bg-red-100 text-red-700",
  upload_document: "bg-blue-100 text-blue-700",
  update_restrictions: "bg-amber-100 text-amber-700",
  login: "bg-slate-100 text-slate-700",
  crear_orden: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
};

function DiffView({ before, after }: { before: Record<string, unknown> | null; after: Record<string, unknown> | null }) {
  const keys = Array.from(new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]));
  if (!keys.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
      <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
        <p className="text-[10px] font-semibold text-red-700 mb-1">Antes</p>
        {keys.map(k => (
          <p key={k} className="text-[10px] text-red-800">
            <span className="font-medium">{k}:</span> {String(before?.[k] ?? "—")}
          </p>
        ))}
      </div>
      <div className="bg-green-50 border border-green-100 rounded-lg p-2.5">
        <p className="text-[10px] font-semibold text-green-700 mb-1">Después</p>
        {keys.map(k => (
          <p key={k} className="text-[10px] text-green-800">
            <span className="font-medium">{k}:</span> {String(after?.[k] ?? "—")}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Filters
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [ipFilter, setIpFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  const fetchLogs = useCallback(async (pg = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (moduleFilter) params.set("module", moduleFilter);
    if (actionFilter) params.set("action", actionFilter);
    if (ipFilter)     params.set("ip", ipFilter);
    if (fromFilter)   params.set("from", fromFilter);
    if (toFilter)     params.set("to", toFilter);
    params.set("page", String(pg));

    try {
      const res = await fetch(`/api/admin/auditoria?${params}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
      setPage(pg);
    } catch {
      // Use empty state on error
    }
    setLoading(false);
  }, [moduleFilter, actionFilter, ipFilter, fromFilter, toFilter]);

  useEffect(() => { fetchLogs(1); }, [fetchLogs]);

  function clearFilters() {
    setModuleFilter(""); setActionFilter(""); setIpFilter("");
    setFromFilter(""); setToFilter("");
  }

  const hasFilters = moduleFilter || actionFilter || ipFilter || fromFilter || toFilter;

  return (
    <div className="container-max py-8">
      <div className="mb-6">
        <h1 className="text-headline-md font-bold">Auditoría del Sistema</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Registro inmutable de todas las acciones con IP, usuario y diferencias de campos
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-medium block mb-1">Módulo</label>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
            >
              {MODULES.map(m => <option key={m} value={m}>{m || "Todos los módulos"}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Acción</label>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
              <input
                value={actionFilter}
                onChange={e => setActionFilter(e.target.value)}
                placeholder="aprobar_registro..."
                className="pl-7 pr-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] w-40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">IP</label>
            <input
              value={ipFilter}
              onChange={e => setIpFilter(e.target.value)}
              placeholder="190.24..."
              className="px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] w-32"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Desde</label>
            <input
              type="date"
              value={fromFilter}
              onChange={e => setFromFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Hasta</label>
            <input
              type="date"
              value={toFilter}
              onChange={e => setToFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-[var(--color-secondary)] hover:underline self-end pb-2">
              Limpiar
            </button>
          )}
        </div>

        <p className="text-xs text-[var(--color-on-surface-variant)] mt-2 flex items-center gap-1">
          <Filter size={11} />
          {loading ? "Cargando..." : `${total.toLocaleString()} registros`}
        </p>
      </div>

      {/* Log table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        {logs.length === 0 && !loading && (
          <div className="text-center py-16 text-[var(--color-on-surface-variant)] text-sm">
            <Clock size={32} className="mx-auto mb-3 opacity-40" />
            {hasFilters ? "Sin registros con los filtros actuales" : "Sin registros de auditoría aún"}
          </div>
        )}

        {logs.map(log => {
          const isOpen = expanded === log.id;
          const userName = log.user.profile
            ? `${log.user.profile.firstName} ${log.user.profile.lastName}`
            : log.user.email;
          const actionClass = ACTION_MAP[log.action] ?? "bg-slate-100 text-slate-600";
          const hasDiff = (log.fieldsBefore && Object.keys(log.fieldsBefore).length > 0) ||
                          (log.fieldsAfter  && Object.keys(log.fieldsAfter).length  > 0);

          return (
            <div key={log.id} className="border-b border-[var(--color-border-subtle)] last:border-b-0">
              <button
                onClick={() => setExpanded(prev => prev === log.id ? null : log.id)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-container-lowest)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${actionClass}`}>{log.action}</span>
                    <span className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">{log.module}</span>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">{log.entityType}/{log.entityId.slice(0, 8)}…</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-[var(--color-on-surface-variant)]">
                    <span>{userName}</span>
                    <span>·</span>
                    <span className="font-medium">{log.userRole}</span>
                    {log.ipAddress && <><span>·</span><span className="font-mono">{log.ipAddress}</span></>}
                    <span>·</span>
                    <span>{new Date(log.createdAt).toLocaleString("es-CO")}</span>
                  </div>
                </div>
                {hasDiff && (isOpen ? <ChevronUp size={14} className="shrink-0 mt-1" /> : <ChevronDown size={14} className="shrink-0 mt-1" />)}
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  {log.comment && (
                    <p className="text-xs italic text-[var(--color-on-surface-variant)] mb-2">"{log.comment}"</p>
                  )}
                  {log.userAgent && (
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-2 font-mono truncate">{log.userAgent}</p>
                  )}
                  <DiffView before={log.fieldsBefore} after={log.fieldsAfter} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Página {page} de {pages} · {total.toLocaleString()} registros
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchLogs(page - 1)}
              disabled={page <= 1}
              className="text-xs px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-lg disabled:opacity-40 hover:bg-[var(--color-surface-container-low)]"
            >
              ← Anterior
            </button>
            <button
              onClick={() => fetchLogs(page + 1)}
              disabled={page >= pages}
              className="text-xs px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-lg disabled:opacity-40 hover:bg-[var(--color-surface-container-low)]"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
