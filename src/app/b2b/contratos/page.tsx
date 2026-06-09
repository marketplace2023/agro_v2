"use client";

import { useState } from "react";
import {
  FileText, Plus, Calendar, CheckCircle, XCircle,
  Clock, Download, Pencil, ChevronDown, ChevronUp,
  Shield,
} from "lucide-react";

type ContractStatus = "borrador" | "activo" | "vencido" | "cancelado";

interface ContractItem {
  productName: string; unit: string;
  pactedPrice: number; minVolume: number | null; maxVolume: number | null;
}

interface Contract {
  id: string; vendorName: string; buyerName: string;
  status: ContractStatus; startDate: string; endDate: string;
  paymentTerms: string; currency: string;
  shippingTerms: string | null; warrantyTerms: string | null; specialClauses: string | null;
  signedDocUrl: string | null; items: ContractItem[];
}

const STATUS_CFG: Record<ContractStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  borrador:  { label: "Borrador", color: "text-slate-600",   bg: "bg-slate-100 border-slate-300",  Icon: Clock },
  activo:    { label: "Activo",   color: "text-green-700",   bg: "bg-green-50 border-green-200",   Icon: CheckCircle },
  vencido:   { label: "Vencido",  color: "text-orange-700",  bg: "bg-orange-50 border-orange-200", Icon: XCircle },
  cancelado: { label: "Cancelado",color: "text-red-700",     bg: "bg-red-50 border-red-200",       Icon: XCircle },
};

const MOCK_CONTRACTS: Contract[] = [
  {
    id: "ct1", vendorName: "DistAgroMax", buyerName: "AgroInversiones S.A.S",
    status: "activo", startDate: "2025-01-01", endDate: "2025-12-31",
    paymentTerms: "30 días desde factura", currency: "USD",
    shippingTerms: "CIF Bogotá — flete incluido en precio pactado",
    warrantyTerms: "Garantía de eficacia 100% o reposición en 30 días",
    specialClauses: "Precio fijo durante todo el período. Sin ajuste por IPC.",
    signedDocUrl: "#",
    items: [
      { productName: "Urea Granulada 46%", unit: "ton", pactedPrice: 820, minVolume: 10, maxVolume: 50 },
      { productName: "NPK 15-15-15", unit: "ton", pactedPrice: 950, minVolume: 5, maxVolume: 30 },
      { productName: "Glifosato 480 SL", unit: "lt", pactedPrice: 16.5, minVolume: 500, maxVolume: 2000 },
    ],
  },
  {
    id: "ct2", vendorName: "BioSolutions", buyerName: "AgroInversiones S.A.S",
    status: "borrador", startDate: "2025-02-01", endDate: "2026-01-31",
    paymentTerms: "15 días desde entrega",
    currency: "USD", shippingTerms: null, warrantyTerms: null,
    specialClauses: "Pendiente de firma del representante legal.",
    signedDocUrl: null,
    items: [
      { productName: "Trichoderma Harzianum", unit: "kg", pactedPrice: 29.0, minVolume: 50, maxVolume: 500 },
      { productName: "Beauveria bassiana WP", unit: "kg", pactedPrice: 27.5, minVolume: 30, maxVolume: 300 },
    ],
  },
  {
    id: "ct3", vendorName: "DistAgroMax", buyerName: "Hacienda Los Robles",
    status: "vencido", startDate: "2024-01-01", endDate: "2024-12-31",
    paymentTerms: "45 días", currency: "USD",
    shippingTerms: "EXW Planta distribuidora", warrantyTerms: null, specialClauses: null,
    signedDocUrl: "#",
    items: [{ productName: "Fosfato Diamónico", unit: "ton", pactedPrice: 1100, minVolume: 5, maxVolume: 20 }],
  },
];

function ContractCard({ contract }: { contract: Contract }) {
  const [open, setOpen] = useState(false);
  const [signing, setSigning] = useState(false);
  const cfg = STATUS_CFG[contract.status];
  const Icon = cfg.Icon;

  const daysLeft = Math.ceil((new Date(contract.endDate).getTime() - Date.now()) / 86400000);
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden ${isExpiringSoon ? "border-orange-200" : "border-[var(--color-border-subtle)]"}`}>
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-[var(--color-surface-container-lowest)]">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              <Icon size={10} />{cfg.label}
            </span>
            {isExpiringSoon && <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">⚡ Vence en {daysLeft} días</span>}
            {contract.signedDocUrl && <span className="text-[10px] text-green-700 flex items-center gap-0.5"><CheckCircle size={9} />Firmado</span>}
          </div>
          <p className="text-sm font-semibold">{contract.vendorName} → {contract.buyerName}</p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            {new Date(contract.startDate).toLocaleDateString("es-CO")} — {new Date(contract.endDate).toLocaleDateString("es-CO")} · {contract.items.length} productos
          </p>
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[var(--color-border-subtle)]">
          {/* Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 mb-4">
            {[
              { label: "Condiciones de pago", value: contract.paymentTerms },
              { label: "Moneda", value: contract.currency },
              { label: "Términos de envío", value: contract.shippingTerms ?? "—" },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">{f.label}</p>
                <p className="text-xs mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Items table */}
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2">Productos pactados</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[var(--color-surface-container-low)] text-[10px] text-[var(--color-on-surface-variant)]">
                    <th className="text-left px-3 py-2 font-semibold rounded-tl-lg">Producto</th>
                    <th className="text-center px-3 py-2 font-semibold">Unidad</th>
                    <th className="text-right px-3 py-2 font-semibold">Precio pactado</th>
                    <th className="text-center px-3 py-2 font-semibold rounded-tr-lg">Volumen mín–máx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {contract.items.map((it, i) => (
                    <tr key={i} className="hover:bg-[var(--color-surface-container-lowest)]">
                      <td className="px-3 py-2 font-medium">{it.productName}</td>
                      <td className="px-3 py-2 text-center">{it.unit}</td>
                      <td className="px-3 py-2 text-right font-bold text-[var(--color-primary)]">${it.pactedPrice.toLocaleString()}/{it.unit}</td>
                      <td className="px-3 py-2 text-center">
                        {it.minVolume ?? "—"} – {it.maxVolume ?? "∞"} {it.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special clauses */}
          {(contract.warrantyTerms || contract.specialClauses) && (
            <div className="mb-4 p-3 bg-[var(--color-surface-container-low)] rounded-lg">
              {contract.warrantyTerms && (
                <div className="mb-2">
                  <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Garantía</p>
                  <p className="text-xs mt-0.5">{contract.warrantyTerms}</p>
                </div>
              )}
              {contract.specialClauses && (
                <div>
                  <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Cláusulas especiales</p>
                  <p className="text-xs mt-0.5 italic">{contract.specialClauses}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {contract.signedDocUrl ? (
              <a href={contract.signedDocUrl} className="flex items-center gap-1.5 text-xs font-medium border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:border-[var(--color-primary)]">
                <Download size={12} /> Descargar PDF firmado
              </a>
            ) : (
              <div className="flex flex-col gap-2">
                {signing ? (
                  <div className="p-3 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-border-subtle)]">
                    <p className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Shield size={12} />Firma electrónica</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-3">Al firmar confirmas que tienes autorización para comprometer a la empresa en este contrato.</p>
                    <div className="flex gap-2">
                      <button className="text-xs font-semibold bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">
                        ✍️ Firmar electrónicamente
                      </button>
                      <button onClick={() => setSigning(false)} className="text-xs border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setSigning(true)} className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg hover:opacity-90">
                    <Shield size={12} /> Firmar contrato
                  </button>
                )}
              </div>
            )}
            <button className="flex items-center gap-1.5 text-xs font-medium border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:border-[var(--color-primary)]">
              <Pencil size={12} /> Editar
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:border-[var(--color-primary)]">
              <Plus size={12} /> Agregar producto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContratosPage() {
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "todos">("todos");
  const [showNew, setShowNew] = useState(false);

  const filtered = statusFilter === "todos"
    ? MOCK_CONTRACTS
    : MOCK_CONTRACTS.filter(c => c.status === statusFilter);

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-headline-md font-bold">Contratos Marco B2B</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Precios y volúmenes pactados, cláusulas y firma electrónica</p>
        </div>
        <button onClick={() => setShowNew(p => !p)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">
          <Plus size={13} /> Nuevo contrato
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(["todos", "borrador", "activo", "vencido", "cancelado"] as const).map(s => {
          const count = s === "todos" ? MOCK_CONTRACTS.length : MOCK_CONTRACTS.filter(c => c.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${statusFilter === s ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"}`}>
              {s === "todos" ? "Todos" : STATUS_CFG[s as ContractStatus].label} ({count})
            </button>
          );
        })}
      </div>

      {showNew && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 mb-4">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2"><FileText size={15} />Nuevo contrato marco</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Empresa compradora *", ph: "AgroInversiones..." },
              { label: "Vendedor *", ph: "DistAgroMax..." },
              { label: "Fecha inicio *", ph: "", type: "date" },
              { label: "Fecha fin *", ph: "", type: "date" },
              { label: "Condiciones de pago *", ph: "30 días desde factura" },
              { label: "Moneda", ph: "USD" },
            ].map(f => (
              <label key={f.label} className="text-xs font-medium">
                {f.label}
                <input type={f.type ?? "text"} placeholder={f.ph}
                  className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="text-xs bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">Crear borrador</button>
            <button onClick={() => setShowNew(false)} className="text-xs border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(c => <ContractCard key={c.id} contract={c} />)}
        {filtered.length === 0 && (
          <div className="text-center py-10 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)] text-sm">
            Sin contratos con los filtros actuales
          </div>
        )}
      </div>
    </div>
  );
}
