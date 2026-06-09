"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const COUNTRIES = [
  { code: "CO", label: "Colombia" },
  { code: "PE", label: "Perú" },
  { code: "MX", label: "México" },
  { code: "CR", label: "Costa Rica" },
  { code: "EC", label: "Ecuador" },
  { code: "CL", label: "Chile" },
  { code: "GT", label: "Guatemala" },
  { code: "PA", label: "Panamá" },
  { code: "BR", label: "Brasil" },
  { code: "AR", label: "Argentina" },
];

export function FilterSidebar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== null) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("pagina");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const toggleFlag = useCallback(
    (key: string) => {
      const current = searchParams.get(key);
      updateParam(key, current === "1" ? null : "1");
    },
    [searchParams, updateParam],
  );

  const hasFilters =
    searchParams.has("regulado") ||
    searchParams.has("biologico") ||
    searchParams.has("organico") ||
    searchParams.has("pais");

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["regulado", "biologico", "organico", "pais"].forEach((k) =>
      params.delete(k),
    );
    params.delete("pagina");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const paisActual = searchParams.get("pais");

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-[var(--color-on-surface)]">
          Filtros
        </h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-[var(--color-secondary)] hover:underline"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Tipo de producto */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">
          Tipo de producto
        </p>
        <div className="space-y-2.5">
          {[
            {
              key: "regulado",
              label: "Regulado ✓",
              colorClass: "text-[var(--color-primary)]",
            },
            {
              key: "biologico",
              label: "🌿 Biológico",
              colorClass: "text-[var(--color-agri-green)]",
            },
            {
              key: "organico",
              label: "🍃 Orgánico",
              colorClass: "text-[var(--color-agri-green)]",
            },
          ].map(({ key, label, colorClass }) => (
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={searchParams.get(key) === "1"}
                onChange={() => toggleFlag(key)}
                className="w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer"
              />
              <span className={cn("text-sm", colorClass)}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-[var(--color-border-subtle)]" />

      {/* País de registro */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">
          País de registro
        </p>
        <div className="space-y-1">
          {COUNTRIES.map(({ code, label }) => {
            const isActive = paisActual === code;
            return (
              <button
                key={code}
                onClick={() => updateParam("pais", isActive ? null : code)}
                className={cn(
                  "flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm text-left transition-colors",
                  isActive
                    ? "bg-[var(--color-primary)] text-white font-medium"
                    : "hover:bg-[var(--color-surface-container-low,#f5f5f5)] text-[var(--color-on-surface)]",
                )}
              >
                {label}
                {isActive && <X className="w-3 h-3 opacity-70" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
