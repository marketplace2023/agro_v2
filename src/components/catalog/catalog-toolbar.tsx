"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const SORT_OPTIONS = [
  { value: "nuevos", label: "Más nuevos" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "mas-vendidos", label: "Más vendidos" },
];

interface CatalogToolbarProps {
  total: number;
  q?: string;
}

export function CatalogToolbar({ total, q }: CatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orden = searchParams.get("orden") ?? "nuevos";

  const setOrden = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orden", value);
    params.delete("pagina");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border-subtle)] gap-4">
      <p className="text-sm text-[var(--color-on-surface-variant)] min-w-0">
        {total > 0 ? (
          <>
            <span className="font-semibold text-[var(--color-on-surface)]">
              {total.toLocaleString("es")}
            </span>{" "}
            producto{total !== 1 ? "s" : ""}
            {q && (
              <>
                {" "}
                para{" "}
                <span className="font-semibold text-[var(--color-primary)]">
                  &ldquo;{q}&rdquo;
                </span>
              </>
            )}
          </>
        ) : q ? (
          <>
            Sin resultados para{" "}
            <span className="font-semibold">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          "Sin productos"
        )}
      </p>

      <select
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        className="shrink-0 text-sm border border-[var(--color-border-subtle)] rounded-md px-3 py-1.5 bg-white text-[var(--color-on-surface)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
