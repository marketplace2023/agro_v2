"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Plus, Edit2, Trash2, Shield,
  CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight,
} from "lucide-react";

interface ApiUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  emailVerified: string | null;
  profile?: {
    firstName: string;
    lastName: string;
    phone?: string | null;
    companyName?: string | null;
  } | null;
}

interface NewUserForm {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

const ALL_ROLES = [
  "admin","vendedor","comprador","fabricante","distribuidor",
  "asesor","regulatorio","logistica","finanzas","soporte",
  "marketing","almacen","representante","experto-regional","credito",
] as const;

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin", vendedor: "Vendedor", comprador: "Comprador",
  fabricante: "Fabricante", distribuidor: "Distribuidor", asesor: "Asesor",
  regulatorio: "Regulatorio", logistica: "Logística", finanzas: "Finanzas",
  soporte: "Soporte", marketing: "Marketing", almacen: "Almacén",
  representante: "Representante", "experto-regional": "Experto Regional", credito: "Crédito",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  vendedor: "bg-blue-100 text-blue-700",
  comprador: "bg-green-100 text-green-700",
  fabricante: "bg-orange-100 text-orange-700",
  distribuidor: "bg-indigo-100 text-indigo-700",
  asesor: "bg-teal-100 text-teal-700",
  regulatorio: "bg-red-100 text-red-700",
  logistica: "bg-yellow-100 text-yellow-700",
  finanzas: "bg-emerald-100 text-emerald-700",
  soporte: "bg-pink-100 text-pink-700",
  marketing: "bg-cyan-100 text-cyan-700",
  almacen: "bg-amber-100 text-amber-700",
  representante: "bg-violet-100 text-violet-700",
  "experto-regional": "bg-lime-100 text-lime-700",
  credito: "bg-rose-100 text-rose-700",
};

const PAGE_LIMIT = 20;

function userName(u: ApiUser) {
  if (!u.profile) return u.email;
  const full = `${u.profile.firstName} ${u.profile.lastName}`.trim();
  return full || u.email;
}

function userStatus(u: ApiUser): "activo" | "pendiente" {
  return u.emailVerified ? "activo" : "pendiente";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
}

const STATUS_CFG = {
  activo:   { label: "Activo",    color: "bg-green-100 text-green-700",   icon: <CheckCircle size={11} /> },
  pendiente:{ label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
};

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<NewUserForm>({ email: "", role: "comprador", firstName: "", lastName: "", companyName: "" });

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_LIMIT),
      ...(search && { search }),
      ...(filterRole !== "todos" && { role: filterRole }),
    });
    fetch(`/api/admin/usuarios?${params}`)
      .then(r => r.json())
      .then(d => {
        setUsers(d.data ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, filterRole]);

  useEffect(() => { load(); }, [load]);

  const filtered = filterStatus === "todos"
    ? users
    : users.filter(u => userStatus(u) === filterStatus);

  const pages = Math.ceil(total / PAGE_LIMIT);
  const activos = users.filter(u => userStatus(u) === "activo").length;
  const pendientes = users.filter(u => userStatus(u) === "pendiente").length;

  async function handleDelete(id: string) {
    setDeleting(true);
    await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    setDeleting(false);
    load();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.role) return;
    setCreating(true);
    const res = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCreating(false);
    if (res.ok) {
      setShowForm(false);
      setForm({ email: "", role: "comprador", firstName: "", lastName: "", companyName: "" });
      load();
    }
  }

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Usuarios del marketplace</h1>
          {!loading && (
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
              {total} usuarios · {activos} activos · {pendientes} pendientes
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"
        >
          <Plus size={15} /> Crear usuario
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total",      value: total,      color: "text-[var(--color-primary)]" },
          { label: "Activos",    value: activos,    color: "text-green-600" },
          { label: "Pendientes", value: pendientes, color: "text-yellow-600" },
          { label: "Esta página",value: users.length, color: "text-[var(--color-on-surface-variant)]" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{loading ? "—" : k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3">
        <form
          className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"
          onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
        >
          <Search size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Buscar usuario, email, empresa..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
          <button type="submit" className="text-xs font-medium text-[var(--color-primary)] hover:underline shrink-0">Buscar</button>
        </form>
        <select
          value={filterRole}
          onChange={e => { setFilterRole(e.target.value); setPage(1); }}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
        >
          <option value="todos">Todos los roles</option>
          {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="pendiente">Pendientes</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-14 text-center text-[var(--color-on-surface-variant)]">
            <p className="text-sm animate-pulse">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
                  {["Usuario", "Rol", "Empresa", "Estado", "Registro", "Acciones"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const st = userStatus(u);
                  const scfg = STATUS_CFG[st];
                  const roleCls = ROLE_COLORS[u.role] ?? "bg-gray-100 text-gray-600";
                  return (
                    <tr key={u.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${roleCls}`}>
                            {userName(u).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{userName(u)}</p>
                            <p className="text-xs text-[var(--color-on-surface-variant)]">{u.email}</p>
                          </div>
                          {u.emailVerified && <CheckCircle size={12} className="text-blue-500 shrink-0" />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${roleCls}`}>
                          <Shield size={9} /> {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">
                        {u.profile?.companyName ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>
                          {scfg.icon} {scfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]" title="Editar">
                            <Edit2 size={13} />
                          </button>
                          {u.role !== "admin" && (
                            <button
                              onClick={() => setConfirmDelete(u.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] text-sm">
                      Sin usuarios con estos filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              {total} usuarios · Página {page} de {pages}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded text-xs font-medium ${n === page ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-low)]"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create user modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-base mb-4">Crear usuario</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              {[
                { label: "Email *", key: "email", type: "email" },
                { label: "Nombre", key: "firstName", type: "text" },
                { label: "Apellido", key: "lastName", type: "text" },
                { label: "Empresa (opcional)", key: "companyName", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type={type}
                    required={key === "email"}
                    value={form[key as keyof NewUserForm]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Rol *</label>
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none"
                >
                  {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-60">
                  {creating ? "Creando…" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-base mb-2">¿Eliminar usuario?</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">
              Esta acción es irreversible. El usuario perderá acceso permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={deleting}
                className="flex-1 bg-red-600 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-60">
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
