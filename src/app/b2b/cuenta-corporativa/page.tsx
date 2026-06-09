"use client";

import { useState } from "react";
import {
  Users, MapPin, DollarSign, Plus, Pencil, Trash2,
  Building2, Leaf, BarChart3, ChevronDown, ChevronUp, ShieldCheck,
} from "lucide-react";

// ─── Mock data ──────────────────────────────────────────────────────────────

interface CompanyUser {
  id: string; name: string; email: string;
  role: string; purchaseLimit: number | null; active: boolean;
}

interface Sede {
  id: string; name: string; type: string; country: string;
  city: string; address: string; latitude: number | null; longitude: number | null;
  cropTypes: string[]; areaTotalHa: number | null;
}

interface CentroCosto {
  id: string; code: string; name: string;
  budget: number; currentSpend: number;
}

const MOCK_USERS: CompanyUser[] = [
  { id: "u1", name: "Diego Martínez", email: "diego@agroinversiones.co", role: "comprador_corporativo", purchaseLimit: 50000, active: true },
  { id: "u2", name: "Claudia Ríos", email: "claudia@agroinversiones.co", role: "comprador", purchaseLimit: 10000, active: true },
  { id: "u3", name: "Jhon Torres", email: "jhon@agroinversiones.co", role: "comprador", purchaseLimit: 5000, active: true },
  { id: "u4", name: "Andrés Molina", email: "andres@agroinversiones.co", role: "finanzas", purchaseLimit: null, active: false },
];

const MOCK_SEDES: Sede[] = [
  { id: "s1", name: "Sede Central Bogotá", type: "sede_central", country: "CO", city: "Bogotá", address: "Av. Eldorado 93-88", latitude: 4.711, longitude: -74.072, cropTypes: [], areaTotalHa: null },
  { id: "s2", name: "Finca El Vergel", type: "finca", country: "CO", city: "Villeta", address: "Vereda El Vergel km 12", latitude: 5.0108, longitude: -74.4736, cropTypes: ["Café", "Cacao", "Plátano"], areaTotalHa: 320 },
  { id: "s3", name: "Finca La Esperanza", type: "finca", country: "CO", city: "Yopal", address: "Km 18 vía Orocué", latitude: 5.337, longitude: -72.395, cropTypes: ["Arroz", "Palma"], areaTotalHa: 850 },
];

const MOCK_CC: CentroCosto[] = [
  { id: "cc1", code: "CC-001", name: "Cultivos Perennes Norte", budget: 120000, currentSpend: 87400 },
  { id: "cc2", code: "CC-002", name: "Cultivos Anuales Sur", budget: 80000, currentSpend: 42000 },
  { id: "cc3", code: "CC-003", name: "Mantenimiento Infraestructura", budget: 40000, currentSpend: 38900 },
  { id: "cc4", code: "CC-004", name: "Investigación y Desarrollo", budget: 25000, currentSpend: 4200 },
];

const ROLE_LABELS: Record<string, string> = {
  comprador: "Comprador", comprador_corporativo: "Comprador Corp.",
  finanzas: "Finanzas", logistica: "Logística", admin: "Admin",
};

const TABS = [
  { id: "usuarios",  label: "Usuarios y Roles",     Icon: Users },
  { id: "sedes",     label: "Sedes y Fincas GPS",   Icon: MapPin },
  { id: "cc",        label: "Centros de Costo",     Icon: BarChart3 },
];

function TabUsuarios() {
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "comprador", purchaseLimit: "" });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(p => !p)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">
          <Plus size={13} /> Invitar usuario
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-xl p-4">
          <p className="text-xs font-semibold mb-3">Nuevo usuario corporativo</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium">
              Nombre completo
              <input className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} />
            </label>
            <label className="text-xs font-medium">
              Email corporativo
              <input type="email" className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} />
            </label>
            <label className="text-xs font-medium">
              Rol
              <select className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
                value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium">
              Límite de compra (USD)
              <input type="number" className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Sin límite si vacío" value={newUser.purchaseLimit}
                onChange={e => setNewUser(p => ({ ...p, purchaseLimit: e.target.value }))} />
            </label>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="text-xs bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">Enviar invitación</button>
            <button onClick={() => setShowForm(false)} className="text-xs border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] border-b border-[var(--color-border-subtle)]">
              <th className="text-left px-4 py-3 font-semibold">Usuario</th>
              <th className="text-left px-4 py-3 font-semibold">Rol</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Límite compra</th>
              <th className="text-left px-4 py-3 font-semibold">Estado</th>
              <th className="text-right px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {MOCK_USERS.map(u => (
              <tr key={u.id} className="hover:bg-[var(--color-surface-container-lowest)]">
                <td className="px-4 py-3">
                  <p className="text-xs font-medium">{u.name}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded">{ROLE_LABELS[u.role] ?? u.role}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs">{u.purchaseLimit ? `$${u.purchaseLimit.toLocaleString()}` : "Sin límite"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold ${u.active ? "text-green-700" : "text-[var(--color-on-surface-variant)]"}`}>
                    {u.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-[var(--color-surface-container)] rounded"><Pencil size={13} className="text-[var(--color-on-surface-variant)]" /></button>
                    <button className="p-1 hover:bg-red-50 rounded"><Trash2 size={13} className="text-[var(--color-secondary)]" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabSedes() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(p => !p)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">
          <Plus size={13} /> Nueva sede / finca
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-xl p-4">
          <p className="text-xs font-semibold mb-3">Nueva sede o finca</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: "name", label: "Nombre", ph: "Finca El Vergel..." },
              { k: "type", label: "Tipo", ph: "" },
              { k: "country", label: "País", ph: "CO" },
              { k: "city", label: "Ciudad", ph: "Villeta" },
              { k: "address", label: "Dirección", ph: "Vereda..." },
              { k: "areaTotalHa", label: "Área total (ha)", ph: "320" },
              { k: "latitude", label: "Latitud GPS", ph: "5.0108" },
              { k: "longitude", label: "Longitud GPS", ph: "-74.4736" },
            ].map(f => (
              <label key={f.k} className="text-xs font-medium">
                {f.label}
                {f.k === "type" ? (
                  <select className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg bg-white focus:outline-none focus:border-[var(--color-primary)]">
                    <option value="finca">Finca</option>
                    <option value="sede_central">Sede Central</option>
                    <option value="sucursal">Sucursal</option>
                    <option value="deposito">Depósito</option>
                  </select>
                ) : (
                  <input placeholder={f.ph} className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
                )}
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button className="text-xs bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">Guardar</button>
            <button onClick={() => setShowForm(false)} className="text-xs border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      {MOCK_SEDES.map(s => {
        const isOpen = expanded === s.id;
        return (
          <div key={s.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
            <button onClick={() => setExpanded(prev => prev === s.id ? null : s.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--color-surface-container-lowest)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                  {s.type === "finca" ? <Leaf size={14} className="text-[var(--color-agri-green)]" /> : <Building2 size={14} className="text-[var(--color-primary)]" />}
                </div>
                <div>
                  <p className="text-xs font-semibold">{s.name}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">{s.city}, {s.country} {s.areaTotalHa ? `· ${s.areaTotalHa} ha` : ""}</p>
                </div>
              </div>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isOpen && (
              <div className="px-4 pb-4 border-t border-[var(--color-border-subtle)]">
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Dirección</p>
                    <p className="text-xs mt-0.5">{s.address}</p>
                  </div>
                  {s.latitude && (
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Coordenadas GPS</p>
                      <p className="text-xs mt-0.5 font-mono">{s.latitude}, {s.longitude}</p>
                    </div>
                  )}
                  {s.cropTypes.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] mb-1">Cultivos</p>
                      <div className="flex flex-wrap gap-1">
                        {s.cropTypes.map(c => <span key={c} className="text-[10px] bg-[var(--color-agri-green)]/10 text-[var(--color-agri-green)] px-2 py-0.5 rounded-full">{c}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                {s.latitude && (
                  <div className="mt-3 h-24 bg-[var(--color-surface-container)] rounded-lg flex items-center justify-center text-xs text-[var(--color-on-surface-variant)]">
                    🗺️ Mapa GPS: {s.latitude.toFixed(4)}, {s.longitude?.toFixed(4)} (Leaflet — lazy loaded)
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TabCentroCosto() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">
          <Plus size={13} /> Nuevo CC
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_CC.map(cc => {
          const pct = cc.budget > 0 ? (cc.currentSpend / cc.budget) * 100 : 0;
          const isHigh = pct > 90;
          return (
            <div key={cc.id} className={`bg-white border rounded-xl p-4 ${isHigh ? "border-red-200" : "border-[var(--color-border-subtle)]"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">{cc.code}</span>
                    {isHigh && <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">⚠ Presupuesto &gt;90%</span>}
                  </div>
                  <p className="text-sm font-semibold mt-1">{cc.name}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-[var(--color-surface-container)] rounded"><Pencil size={13} className="text-[var(--color-on-surface-variant)]" /></button>
                </div>
              </div>

              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--color-on-surface-variant)]">Ejecutado</span>
                <span className={`font-bold ${isHigh ? "text-red-700" : ""}`}>
                  ${cc.currentSpend.toLocaleString()} / ${cc.budget.toLocaleString()} ({pct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isHigh ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-[var(--color-agri-green)]"}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--color-on-surface-variant)] mt-1">
                <span>Disponible: ${(cc.budget - cc.currentSpend).toLocaleString()}</span>
                <span className="flex items-center gap-0.5"><DollarSign size={9} />Presupuesto: ${cc.budget.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={14} className="text-[var(--color-primary)]" />
          <p className="text-xs font-semibold text-[var(--color-primary)]">Resumen consolidado</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Presupuesto total", value: `$${MOCK_CC.reduce((s, c) => s + c.budget, 0).toLocaleString()}` },
            { label: "Ejecutado total", value: `$${MOCK_CC.reduce((s, c) => s + c.currentSpend, 0).toLocaleString()}` },
            { label: "Disponible total", value: `$${MOCK_CC.reduce((s, c) => s + (c.budget - c.currentSpend), 0).toLocaleString()}` },
          ].map(k => (
            <div key={k.label}>
              <p className="text-sm font-bold">{k.value}</p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)]">{k.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CuentaCorporativaPage() {
  const [activeTab, setActiveTab] = useState("usuarios");

  return (
    <div className="container-max py-8">
      <div className="mb-6">
        <h1 className="text-headline-md font-bold">Cuenta Corporativa</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          AgroInversiones S.A.S · NIT 900.112.233-5
        </p>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="flex border-b border-[var(--color-border-subtle)] overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.Icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium shrink-0 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                }`}>
                <Icon size={14} />{tab.label}
              </button>
            );
          })}
        </div>
        <div className="p-6">
          {activeTab === "usuarios" && <TabUsuarios />}
          {activeTab === "sedes"    && <TabSedes />}
          {activeTab === "cc"       && <TabCentroCosto />}
        </div>
      </div>
    </div>
  );
}
