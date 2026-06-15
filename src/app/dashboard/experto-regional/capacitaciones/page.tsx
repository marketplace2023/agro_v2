"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Calendar, User, Tag, Plus, ExternalLink } from "lucide-react";

interface Capacitacion {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  tags: string[];
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  author: {
    email: string;
    profile?: { firstName: string; lastName: string } | null;
  };
}

export default function CapacitacionesPage() {
  const [items, setItems] = useState<Capacitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/experto-regional/capacitaciones")
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.title.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q));
  });

  const publicadas  = items.filter((c) => c.published).length;
  const borradores  = items.filter((c) => !c.published).length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Capacitaciones</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Material formativo y talleres para productores</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90">
          <Plus size={15} /> Nueva capacitación
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total capacitaciones", value: items.length,  color: "text-[var(--color-primary)]" },
          { label: "Publicadas",           value: publicadas,    color: "text-green-600" },
          { label: "Borradores",           value: borradores,    color: "text-orange-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
        <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o etiqueta..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <BookOpen size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando capacitaciones...</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]">
          <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No hay capacitaciones aún</p>
          <p className="text-xs mt-1 max-w-xs mx-auto">
            Crea una nueva capacitación con la categoría <strong>capacitacion</strong> desde el módulo de blog o usa el botón de arriba.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((cap) => {
            const authorName = cap.author.profile
              ? `${cap.author.profile.firstName} ${cap.author.profile.lastName}`
              : cap.author.email;
            const date = cap.publishedAt ?? cap.createdAt;

            return (
              <div key={cap.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden flex flex-col">
                {cap.coverImageUrl ? (
                  <img src={cap.coverImageUrl} alt={cap.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-agri-green)]/10 flex items-center justify-center">
                    <BookOpen size={32} className="text-[var(--color-primary)]/40" />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-snug flex-1">{cap.title}</h3>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${cap.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {cap.published ? "Publicada" : "Borrador"}
                    </span>
                  </div>

                  {cap.excerpt && (
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-1.5 line-clamp-2">{cap.excerpt}</p>
                  )}

                  {cap.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cap.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] bg-[var(--color-surface-container-low)] px-1.5 py-0.5 rounded-full text-[var(--color-on-surface-variant)]">
                          <Tag size={8} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-auto pt-3 text-xs text-[var(--color-on-surface-variant)]">
                    <span className="flex items-center gap-1"><User size={10} /> {authorName}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(date).toLocaleDateString("es-CO")}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <a
                      href={`/blog/${cap.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs font-medium border border-[var(--color-border-subtle)] py-1.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <ExternalLink size={11} /> Ver
                    </a>
                    <button className="flex-1 text-xs font-medium bg-[var(--color-primary)] text-white py-1.5 rounded-lg hover:opacity-90">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
