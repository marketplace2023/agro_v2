"use client";

import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Shield, User, CheckCircle, XCircle, Clock } from "lucide-react";

type UserRole = "admin" | "vendedor" | "comprador" | "fabricante" | "distribuidor" | "asesor" | "regulatorio" | "logistica" | "finanzas" | "soporte" | "marketing";
type UserStatus = "activo" | "suspendido" | "pendiente";

interface PlatformUser {
  id: string; name: string; email: string; role: UserRole;
  company?: string; country: string; status: UserStatus;
  lastLogin: string; createdAt: string; verified: boolean;
}

const MOCK_USERS: PlatformUser[] = [
  { id: "u1", name: "Admin Sistema", email: "admin@demo.com", role: "admin", country: "CO", status: "activo", lastLogin: "2026-06-10 08:45", createdAt: "2025-01-01", verified: true },
  { id: "u2", name: "María Vendedora", email: "vendedor@demo.com", role: "vendedor", company: "DistAgroMax SAS", country: "CO", status: "activo", lastLogin: "2026-06-10 10:30", createdAt: "2025-03-15", verified: true },
  { id: "u3", name: "Carlos Comprador", email: "comprador@demo.com", role: "comprador", company: "Finca El Progreso", country: "CO", status: "activo", lastLogin: "2026-06-09 15:20", createdAt: "2025-05-20", verified: true },
  { id: "u4", name: "José Asesor", email: "asesor@demo.com", role: "asesor", country: "CO", status: "activo", lastLogin: "2026-06-08 09:00", createdAt: "2025-04-10", verified: true },
  { id: "u5", name: "Ana Regulatoria", email: "regulatorio@demo.com", role: "regulatorio", country: "CO", status: "activo", lastLogin: "2026-06-07 14:15", createdAt: "2025-02-28", verified: true },
  { id: "u6", name: "Pedro Pendiente", email: "pedro@pendiente.com", role: "vendedor", company: "AgroVentas SRL", country: "VE", status: "pendiente", lastLogin: "—", createdAt: "2026-06-08", verified: false },
  { id: "u7", name: "Laura Suspendida", email: "laura@suspendida.com", role: "comprador", country: "EC", status: "suspendido", lastLogin: "2026-05-01 11:00", createdAt: "2025-06-01", verified: true },
];

const ROLE_LABELS: Record<UserRole, string> = { admin: "Admin", vendedor: "Vendedor", comprador: "Comprador", fabricante: "Fabricante", distribuidor: "Distribuidor", asesor: "Asesor", regulatorio: "Regulatorio", logistica: "Logística", finanzas: "Finanzas", soporte: "Soporte", marketing: "Marketing" };
const ROLE_COLORS: Record<UserRole, string> = { admin: "bg-purple-100 text-purple-700", vendedor: "bg-blue-100 text-blue-700", comprador: "bg-green-100 text-green-700", fabricante: "bg-orange-100 text-orange-700", distribuidor: "bg-indigo-100 text-indigo-700", asesor: "bg-teal-100 text-teal-700", regulatorio: "bg-red-100 text-red-700", logistica: "bg-yellow-100 text-yellow-700", finanzas: "bg-emerald-100 text-emerald-700", soporte: "bg-pink-100 text-pink-700", marketing: "bg-cyan-100 text-cyan-700" };

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const q = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || (u.company || "").toLowerCase().includes(search.toLowerCase());
    const r = filterRole === "todos" || u.role === filterRole;
    const s = filterStatus === "todos" || u.status === filterStatus;
    return q && r && s;
  });

  function toggleStatus(id: string) { setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "activo" ? "suspendido" as UserStatus : "activo" as UserStatus } : u)); }
  function deleteUser(id: string) { setUsers(prev => prev.filter(u => u.id !== id)); setConfirmDelete(null); }

  const STATUS_CFG: Record<UserStatus, { label: string; color: string; icon: React.ReactNode }> = {
    activo: { label: "Activo", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
    suspendido: { label: "Suspendido", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
    pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  };

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Usuarios del marketplace</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{users.filter(u => u.status === "activo").length} activos · {users.filter(u => u.status === "pendiente").length} pendientes de aprobación</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Crear usuario</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: "Total", value: users.length, color: "text-[var(--color-primary)]" }, { label: "Activos", value: users.filter(u => u.status === "activo").length, color: "text-green-600" }, { label: "Pendientes", value: users.filter(u => u.status === "pendiente").length, color: "text-yellow-600" }, { label: "Suspendidos", value: users.filter(u => u.status === "suspendido").length, color: "text-red-600" }].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario, email, empresa..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"><option value="todos">Todos los roles</option>{Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"><option value="todos">Todos los estados</option><option value="activo">Activos</option><option value="pendiente">Pendientes</option><option value="suspendido">Suspendidos</option></select>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              {["Usuario", "Rol", "Empresa / País", "Estado", "Último acceso", "Acciones"].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((u, i) => {
                const scfg = STATUS_CFG[u.status];
                return (
                  <tr key={u.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ROLE_COLORS[u.role]}`}>{u.name.slice(0, 1)}</div>
                        <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{u.email}</p></div>
                        {u.verified && <CheckCircle size={12} className="text-blue-500 flex-shrink-0" />}
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}><Shield size={9} /> {ROLE_LABELS[u.role]}</span></td>
                    <td className="px-4 py-3"><p className="text-xs">{u.company || "—"}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{u.country}</p></td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span></td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]"><Edit2 size={13} /></button>
                        <button onClick={() => toggleStatus(u.id)} className={`p-1.5 rounded-lg ${u.status === "activo" ? "hover:bg-red-50 text-red-500" : "hover:bg-green-50 text-green-600"}`}>{u.status === "activo" ? <XCircle size={13} /> : <CheckCircle size={13} />}</button>
                        {u.role !== "admin" && <button onClick={() => setConfirmDelete(u.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={13} /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Crear usuario</h3>
            <div className="space-y-3">
              {[["Nombre completo", "text"], ["Email", "email"], ["Contraseña temporal", "password"], ["Empresa (opcional)", "text"]].map(([label, type]) => (<div key={String(label)}><label className="block text-sm font-medium mb-1">{label}</label><input type={type} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>))}
              <div><label className="block text-sm font-medium mb-1">Rol</label><select className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none">{Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg">Crear</button></div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-base mb-2">¿Eliminar usuario?</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">Esta acción es irreversible. El usuario perderá acceso permanentemente.</p>
            <div className="flex gap-3"><button onClick={() => setConfirmDelete(null)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => deleteUser(confirmDelete)} className="flex-1 bg-red-600 text-white text-sm font-medium py-2 rounded-lg">Eliminar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
