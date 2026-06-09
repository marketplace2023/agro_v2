import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pagina: number;
  paginas: number;
  buildHref: (page: number) => string;
}

export function Pagination({ pagina, paginas, buildHref }: PaginationProps) {
  if (paginas <= 1) return null;

  // Build page number array with ellipsis
  const pages: (number | "...")[] = [];
  if (paginas <= 7) {
    for (let i = 1; i <= paginas; i++) pages.push(i);
  } else {
    pages.push(1);
    if (pagina > 3) pages.push("...");
    const start = Math.max(2, pagina - 1);
    const end = Math.min(paginas - 1, pagina + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (pagina < paginas - 2) pages.push("...");
    pages.push(paginas);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1 py-8"
      aria-label="Paginación de resultados"
    >
      {pagina > 1 && (
        <Link
          href={buildHref(pagina - 1)}
          className="p-2 rounded-md text-[var(--color-on-surface-variant)] hover:bg-gray-100 transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-3 py-1 text-sm text-[var(--color-on-surface-variant)]"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              p === pagina
                ? "bg-[var(--color-primary)] text-white"
                : "hover:bg-gray-100 text-[var(--color-on-surface)]",
            )}
            aria-current={p === pagina ? "page" : undefined}
          >
            {p}
          </Link>
        ),
      )}

      {pagina < paginas && (
        <Link
          href={buildHref(pagina + 1)}
          className="p-2 rounded-md text-[var(--color-on-surface-variant)] hover:bg-gray-100 transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}
