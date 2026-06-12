"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User, Mail, Phone, MapPin, Lock, Bell, Shield,
  Camera, CheckCircle, AlertTriangle, Eye, EyeOff, Save
} from "lucide-react";

const TABS = ["Datos personales", "Seguridad", "Notificaciones", "Empresa"] as const;
type Tab = typeof TABS[number];

const COUNTRIES = ["Colombia", "México", "Ecuador", "Perú", "Brasil", "Venezuela", "Argentina", "Chile"];

const ROLE_LABELS: Record<string, string> = {
  comprador: "Comprador",
  comprador_corporativo: "Comprador corporativo",
  vendedor: "Vendedor",
  fabricante: "Fabricante",
  distribuidor: "Distribuidor",
  asesor: "Asesor agronómico",
  logistica: "Logística",
  regulatorio: "Regulatorio",
  finanzas: "Finanzas",
  soporte: "Soporte",
  marketing: "Marketing",
  almacen: "Almacén",
  representante: "Representante comercial",
  "experto-regional": "Experto regional",
  credito: "Analista de crédito",
  admin: "Administrador",
};

export default function PerfilPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("Datos personales");
  const [saved, setSaved] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    country: "Colombia", city: "", bio: "",
  });

  useEffect(() => {
    if (session?.user) {
      const parts = (session.user.name ?? "").trim().split(" ");
      setProfile(p => ({
        ...p,
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
        email: session.user.email ?? "",
      }));
    }
  }, [session]);

  const role = (session?.user as { role?: string })?.role ?? "comprador";
  const roleLabel = ROLE_LABELS[role] ?? role;

  const [passwords, setPasswords] = useState({ old: "", nuevo: "", confirm: "" });

  const [notifPrefs, setNotifPrefs] = useState({
    email_ordenes: true, email_pagos: true, email_regulatorio: true,
    email_logistica: true, email_marketing: false,
    push_ordenes: true, push_pagos: false, push_logistica: true,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const initials = profile.firstName
    ? `${profile.firstName[0]}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "…";

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header card */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-6 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-bold select-none">
            {initials}
          </div>
          <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-[var(--color-border-subtle)] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <Camera size={13} className="text-[var(--color-on-surface-variant)]" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[var(--color-on-surface)]">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-1.5 mt-0.5">
            <Mail size={13} /> {profile.email}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full font-medium">
              <CheckCircle size={11} /> Cuenta verificada
            </span>
            <span className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] px-2.5 py-0.5 rounded-full">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--color-border-subtle)]">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Datos personales */}
      {tab === "Datos personales" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
            <User size={16} className="text-[var(--color-primary)]" /> Información personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre" icon={<User size={14} />}>
              <input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} className="input-field" />
            </Field>
            <Field label="Apellido" icon={<User size={14} />}>
              <input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} className="input-field" />
            </Field>
            <Field label="Correo electrónico" icon={<Mail size={14} />}>
              <input value={profile.email} disabled className="input-field opacity-60 cursor-not-allowed" />
            </Field>
            <Field label="Teléfono" icon={<Phone size={14} />}>
              <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="+57 300 000 0000" />
            </Field>
            <Field label="País" icon={<MapPin size={14} />}>
              <select value={profile.country} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))} className="input-field">
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Ciudad" icon={<MapPin size={14} />}>
              <input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} className="input-field" placeholder="Tu ciudad" />
            </Field>
          </div>
          <Field label="Acerca de mí" icon={<User size={14} />}>
            <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Cuéntanos sobre ti o tu empresa..." className="input-field resize-none" />
          </Field>
          <SaveBar saved={saved} onSave={handleSave} />
        </div>
      )}

      {/* Seguridad */}
      {tab === "Seguridad" && (
        <div className="space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2"><Lock size={16} className="text-[var(--color-primary)]" /> Cambiar contraseña</h2>
            <div className="space-y-4 max-w-sm">
              <Field label="Contraseña actual" icon={<Lock size={14} />}>
                <div className="relative">
                  <input type={showOldPass ? "text" : "password"} value={passwords.old} onChange={e => setPasswords(p => ({ ...p, old: e.target.value }))} placeholder="••••••••" className="input-field pr-10" />
                  <button onClick={() => setShowOldPass(!showOldPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">{showOldPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                </div>
              </Field>
              <Field label="Nueva contraseña" icon={<Lock size={14} />}>
                <div className="relative">
                  <input type={showNewPass ? "text" : "password"} value={passwords.nuevo} onChange={e => setPasswords(p => ({ ...p, nuevo: e.target.value }))} placeholder="Mínimo 8 caracteres" className="input-field pr-10" />
                  <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">{showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                </div>
                {passwords.nuevo.length > 0 && passwords.nuevo.length < 8 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={11} /> Mínimo 8 caracteres</p>
                )}
              </Field>
              <Field label="Confirmar nueva contraseña" icon={<Lock size={14} />}>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="Repetir contraseña" className="input-field" />
                {passwords.confirm.length > 0 && passwords.confirm !== passwords.nuevo && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={11} /> Las contraseñas no coinciden</p>
                )}
              </Field>
            </div>
            <button onClick={handleSave} disabled={!passwords.old || passwords.nuevo.length < 8 || passwords.nuevo !== passwords.confirm} className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
              Actualizar contraseña
            </button>
          </div>
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Shield size={16} className="text-[var(--color-primary)]" /> Sesiones activas</h2>
            {[
              { device: "Chrome · Windows 10", location: "Bogotá, Colombia", time: "Activo ahora", current: true },
              { device: "Safari · iPhone 15", location: "Bogotá, Colombia", time: "Hace 2 días", current: false },
            ].map(s => (
              <div key={s.device} className="flex items-center justify-between gap-3 py-3 border-b border-[var(--color-border-subtle)] last:border-0">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {s.device}
                    {s.current && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Esta sesión</span>}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.location} · {s.time}</p>
                </div>
                {!s.current && <button className="text-xs text-red-500 hover:underline">Cerrar sesión</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notificaciones */}
      {tab === "Notificaciones" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-6 space-y-6">
          <h2 className="font-semibold flex items-center gap-2"><Bell size={16} className="text-[var(--color-primary)]" /> Preferencias de notificaciones</h2>
          {[
            { group: "Por correo electrónico", prefix: "email" },
            { group: "Notificaciones push", prefix: "push" },
          ].map(({ group, prefix }) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{group}</h3>
              <div className="space-y-3">
                {[
                  { key: `${prefix}_ordenes`, label: "Órdenes y pedidos", desc: "Nuevo pedido, cambios de estado, confirmaciones" },
                  { key: `${prefix}_pagos`, label: "Pagos y facturación", desc: "Transacciones, liquidaciones, reembolsos" },
                  ...(prefix === "email" ? [{ key: `${prefix}_regulatorio`, label: "Alertas regulatorias", desc: "Vencimientos, documentos pendientes" }] : []),
                  { key: `${prefix}_logistica`, label: "Actualizaciones de envío", desc: "Cambios de estado de despacho" },
                  ...(prefix === "email" ? [{ key: `${prefix}_marketing`, label: "Ofertas y promociones", desc: "Descuentos, novedades y campañas" }] : []),
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifPrefs[key as keyof typeof notifPrefs] ? "bg-[var(--color-primary)]" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifPrefs[key as keyof typeof notifPrefs] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <SaveBar saved={saved} onSave={handleSave} />
        </div>
      )}

      {/* Empresa */}
      {tab === "Empresa" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold">Información de empresa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Razón social", placeholder: "Nombre legal completo" },
              { label: "NIT / RUC / RFC", placeholder: "Número de identificación tributaria" },
              { label: "Nombre comercial", placeholder: "Nombre como opera el negocio" },
              { label: "Sector", placeholder: "Distribución, Producción, etc." },
            ].map(f => (
              <Field key={f.label} label={f.label}>
                <input placeholder={f.placeholder} className="input-field" />
              </Field>
            ))}
            <Field label="Dirección fiscal"><input placeholder="Calle, número, barrio..." className="input-field" /></Field>
            <Field label="Ciudad / Municipio"><input placeholder="Ciudad" className="input-field" /></Field>
          </div>
          <SaveBar saved={saved} onSave={handleSave} />
        </div>
      )}

      <style jsx global>{`
        .input-field {
          width: 100%;
          border: 1px solid var(--color-border-subtle);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
          transition: border-color 0.15s;
        }
        .input-field:focus { border-color: var(--color-primary); }
      `}</style>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--color-on-surface-variant)] flex items-center gap-1.5">{icon} {label}</label>
      {children}
    </div>
  );
}

function SaveBar({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
      {saved
        ? <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle size={15} /> Cambios guardados</span>
        : <span className="text-xs text-[var(--color-on-surface-variant)]">Los cambios no se guardan automáticamente</span>
      }
      <button onClick={onSave} className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
        <Save size={14} /> Guardar cambios
      </button>
    </div>
  );
}
