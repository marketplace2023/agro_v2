"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

interface RecentItem { slug: string; name: string; price: number; }

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("agro-recientes");
      if (raw) setItems(JSON.parse(raw).slice(0, 6));
    } catch { /* */ }
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <Clock size={12} /> Vistos recientemente
      </h3>
      <div className="flex gap-2 flex-wrap">
        {items.map(item => (
          <Link key={item.slug} href={`/productos/${item.slug}`}
            className="text-xs border border-[var(--color-border-subtle)] rounded-full px-3 py-1 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors bg-white truncate max-w-[200px]">
            {item.name} · ${item.price}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function trackRecentView(slug: string, name: string, price: number) {
  try {
    const raw = sessionStorage.getItem("agro-recientes");
    const prev: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = prev.filter(i => i.slug !== slug);
    sessionStorage.setItem("agro-recientes", JSON.stringify([{ slug, name, price }, ...filtered].slice(0, 10)));
  } catch { /* */ }
}
