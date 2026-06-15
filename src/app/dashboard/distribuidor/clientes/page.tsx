"use client";

import { useEffect, useState } from "react";
import { Search, Users, TrendingUp, ShoppingBag, MapPin } from "lucide-react";

interface Client {
  buyerId: string;
  name: string;
  email: string;
  company: string;
  city: string;
  country: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string;
}

export default function DistribuidorClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/distribuidor/clientes")
      .then((r) => r.json())
      .then((res) => setClients(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });

  const totalRevenue = clients.reduce((s, c) => s + c.totalAmount, 0);
  const totalOrders  = clients.reduce((s, c) => s + c.totalOrders, 0);
  const activeThisMonth = clients.filter((c) => {
    const d = new Date(c.lastOrderDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-headline-md font-bold">Mis Clientes</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Compradores que han pedido a través de tu distribución</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total clientes",   value: clients.length,                                       color: "text-[var(--color-primary)]",  icon: <Users size={16} /> },
          { label: "Activos este mes", value: activeThisMonth,                                       color: "text-green-600",               icon: <TrendingUp size={16} /> },
          { label: "Órdenes totales",  value: totalOrders,                                           color: "text-blue-600",                icon: <ShoppingBag size={16} /> },
          { label: "Ingresos totales", value: `$${totalRevenue.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, color: "text-[var(--color-secondary)]", icon: <TrendingUp size={16} /> },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-start gap-3">
            <div className={`mt-0.5 ${k.color}`}>{k.icon}</div>
            <div>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
        <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, empresa o ciudad..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <Users size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando clientes...</p>
        </div>
      )}

      {!loading && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
                  {["Cliente", "Ubicación", "Órdenes", "Total compras", "Última orden"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((client, i) => (
                  <tr
                    key={client.buyerId}
                    className={`border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-surface-container-lowest)] ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{client.company}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{client.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs flex items-center gap-1 text-[var(--color-on-surface-variant)]">
                        <MapPin size={10} /> {client.city !== "—" ? `${client.city}, ` : ""}{client.country}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">{client.totalOrders}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      ${client.totalAmount.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">
                      {new Date(client.lastOrderDate).toLocaleDateString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-[var(--color-on-surface-variant)]">
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No se encontraron clientes</p>
              </div>
            )}
          </div>
          {clients.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-on-surface-variant)]">
              {filtered.length} de {clients.length} clientes
            </div>
          )}
        </div>
      )}
    </div>
  );
}
