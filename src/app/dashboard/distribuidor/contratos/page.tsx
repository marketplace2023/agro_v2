"use client";

import { useEffect, useState } from "react";
import { Search, FileText, CheckCircle, Clock, XCircle, AlertTriangle, ChevronDown } from "lucide-react";

type ContractStatus = "borrador" | "activo" | "vencido" | "cancelado";

interface ContractItem {
  id: string;
  productName: string;
  pactedPrice: number;
  minVolume?: number | null;
  maxVolume?: number | null;
  unit: string;
}

interface Contract {
  id: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  currency: string;
  paymentTerms?: string | null;
  shippingTerms?: string | null;
  signedDocUrl?: string | null;
  createdAt: string;
  buyerCompany: { name: string; commercialName?: string | null; country: string; city?: string | null };
  vendorCompany: { name: string; commercialName?: string | null };
  items: ContractItem[];
}

const STATUS_CFG: Record<ContractStatus, { label: string; color: string; icon: React.ReactNode }> = {
  borrador:  { label: "Borrador",  color: "bg-gray-100 text-gray-600",    icon: <Clock size={11} /> },
  activo:    { label: "Activo",    color: "bg-green-100 text-green-700",  icon: <CheckCircle size={11} /> },
  vencido:   { label: "Vencido",   color: "bg-orange-100 text-orange-700",icon: <AlertTriangle size={11} /> },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700",      icon: <XCircle size={11} /> },
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export default function DistribuidorContratosPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/distribuidor/contratos")
      .then((r) => r.json())
      .then((res) => setContracts(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contracts.filter((c) => {
    const buyer = c.buyerCompany.commercialName ?? c.buyerCompany.name;
    const matchQ = !search || buyer.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchS = filterStatus === "todos" || c.status === filterStatus;
    return matchQ && matchS;
  });

  const counts = {
    activos:  contracts.filter((c) => c.status === "activo").length,
    vencidos: contracts.filter((c) => c.status === "vencido").length,
    proximos: contracts.filter((c) => c.status === "activo" && daysUntil(c.endDate) <= 30).length,
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-headline-md font-bold">Contratos</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Acuerdos marco con fabricantes y compradores</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Contratos activos",   value: counts.activos,  color: "text-green-600" },
          { label: "Por vencer (≤30d)",   value: counts.proximos, color: "text-orange-600" },
          { label: "Vencidos",            value: counts.vencidos, color: "text-red-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por empresa o ID..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="borrador">Borradores</option>
          <option value="vencido">Vencidos</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <FileText size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando contratos...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {filtered.map((contract) => {
            const cfg = STATUS_CFG[contract.status];
            const buyer = contract.buyerCompany.commercialName ?? contract.buyerCompany.name;
            const days = daysUntil(contract.endDate);
            const isExpanded = expanded === contract.id;

            return (
              <div key={contract.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
                <div
                  className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : contract.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{buyer}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      {contract.status === "activo" && days <= 30 && days > 0 && (
                        <span className="text-xs text-orange-600 font-medium">⚠ Vence en {days}d</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                      {contract.buyerCompany.city ?? ""} {contract.buyerCompany.country} · {contract.items.length} producto{contract.items.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      {new Date(contract.startDate).toLocaleDateString("es-CO")} → {new Date(contract.endDate).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{contract.currency}</p>
                    {contract.paymentTerms && (
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{contract.paymentTerms}</p>
                    )}
                  </div>
                  <ChevronDown size={16} className={`text-[var(--color-on-surface-variant)] transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                </div>

                {isExpanded && (
                  <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-4">
                    {contract.items.length > 0 && (
                      <div className="overflow-x-auto">
                        <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Productos del contrato</p>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-[var(--color-on-surface-variant)]">
                              <th className="text-left pb-2">Producto</th>
                              <th className="text-right pb-2">Precio pactado</th>
                              <th className="text-right pb-2">Vol. mín</th>
                              <th className="text-right pb-2">Vol. máx</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contract.items.map((item) => (
                              <tr key={item.id} className="border-t border-[var(--color-border-subtle)]">
                                <td className="py-2 font-medium">{item.productName}</td>
                                <td className="py-2 text-right font-semibold">${item.pactedPrice.toFixed(2)}/{item.unit}</td>
                                <td className="py-2 text-right text-[var(--color-on-surface-variant)]">{item.minVolume ?? "—"} {item.unit}</td>
                                <td className="py-2 text-right text-[var(--color-on-surface-variant)]">{item.maxVolume ?? "—"} {item.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {contract.shippingTerms && (
                      <p className="text-xs text-[var(--color-on-surface-variant)]">
                        <span className="font-medium">Condiciones de envío:</span> {contract.shippingTerms}
                      </p>
                    )}
                    {contract.signedDocUrl && (
                      <a
                        href={contract.signedDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
                      >
                        <FileText size={13} /> Ver contrato firmado
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]">
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No se encontraron contratos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
