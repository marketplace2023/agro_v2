"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Star, Search, Trash2, Package, ExternalLink } from "lucide-react";
import Link from "next/link";

interface FavProduct {
  id: string; name: string; sku: string; vendor: string; category: string;
  price: number; currency: string; unit: string; minOrder: number;
  rating: number; reviewCount: number; inStock: boolean; isRegulated: boolean;
  savedAt: string; image?: string;
}

const MOCK_FAVORITES: FavProduct[] = [
  { id: "f1", name: "Glifosato 480 SL Herbicida", sku: "HRB-GLF-480-5L", vendor: "DistAgroMax SAS", category: "Herbicidas", price: 48.50, currency: "USD", unit: "5L", minOrder: 10, rating: 4.7, reviewCount: 142, inStock: true, isRegulated: true, savedAt: "2026-06-05" },
  { id: "f2", name: "NPK 15-15-15 Fertilizante Granulado", sku: "FRT-NPK-151515-50K", vendor: "AgroSuministros CO", category: "Fertilizantes", price: 22.10, currency: "USD", unit: "50Kg", minOrder: 5, rating: 4.5, reviewCount: 89, inStock: true, isRegulated: false, savedAt: "2026-06-03" },
  { id: "f3", name: "Beauveria bassiana WP Entomopatógeno", sku: "BIO-BEA-WP-1K", vendor: "BioSolutions Corp", category: "Biológicos", price: 41.00, currency: "USD", unit: "1Kg", minOrder: 5, rating: 4.9, reviewCount: 67, inStock: true, isRegulated: true, savedAt: "2026-05-28" },
  { id: "f4", name: "Sulfato de Potasio 50% K2O", sku: "FRT-SPO-50-25K", vendor: "NutriPlant Ltda", category: "Fertilizantes", price: 31.50, currency: "USD", unit: "25Kg", minOrder: 4, rating: 4.6, reviewCount: 34, inStock: false, isRegulated: false, savedAt: "2026-05-20" },
  { id: "f5", name: "Abamectina 1.8 EC Acaricida-Nematicida", sku: "ACA-ABA-18-1L", vendor: "DistAgroMax SAS", category: "Insecticidas", price: 38.20, currency: "USD", unit: "1L", minOrder: 20, rating: 4.4, reviewCount: 58, inStock: true, isRegulated: true, savedAt: "2026-05-15" },
];

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("todas");

  const categories = ["todas", ...new Set(MOCK_FAVORITES.map(f => f.category))];
  const filtered = favorites.filter(f => {
    const q = f.name.toLowerCase().includes(search.toLowerCase()) || f.vendor.toLowerCase().includes(search.toLowerCase());
    const c = filterCat === "todas" || f.category === filterCat;
    return q && c;
  });

  function removeFav(id: string) { setFavorites(prev => prev.filter(f => f.id !== id)); }

  function Stars({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} className={i <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />)}
        <span className="text-xs text-[var(--color-on-surface-variant)] ml-1">{rating}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Heart size={22} className="fill-red-500 text-red-500" /><div><h1 className="text-2xl font-bold">Mis favoritos</h1><p className="text-sm text-[var(--color-on-surface-variant)]">{favorites.length} productos guardados</p></div></div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en tus favoritos..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize ${filterCat === c ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{c === "todas" ? "Todas" : c}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-12 flex flex-col items-center gap-3 text-[var(--color-on-surface-variant)]">
          <Heart size={48} strokeWidth={1.5} />
          <p className="font-medium">No tienes productos favoritos aún</p>
          <Link href="/catalogo" className="text-sm text-[var(--color-primary)] hover:underline">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(fav => (
            <div key={fav.id} className="bg-white border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-[var(--color-surface-container-low)] h-32 flex items-center justify-center relative">
                <Package size={40} className="text-[var(--color-on-surface-variant)]" strokeWidth={1.5} />
                <button onClick={() => removeFav(fav.id)} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-red-50 text-red-400"><Heart size={14} className="fill-red-400" /></button>
                {!fav.inStock && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Sin stock</span></div>}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <div><p className="font-semibold text-sm line-clamp-2">{fav.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{fav.vendor}</p></div>
                  {fav.isRegulated && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">Regulado</span>}
                </div>
                <Stars rating={fav.rating} />
                <div className="flex items-end justify-between">
                  <div><p className="text-lg font-bold text-[var(--color-primary)]">${fav.price.toFixed(2)}</p><p className="text-xs text-[var(--color-on-surface-variant)]">por {fav.unit} · mín. {fav.minOrder} ud.</p></div>
                  <span className="text-xs bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded text-[var(--color-on-surface-variant)]">{fav.category}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button disabled={!fav.inStock} className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold py-2 rounded-xl hover:opacity-90 disabled:opacity-50"><ShoppingCart size={13} /> Agregar al carrito</button>
                  <Link href={`/catalogo/${fav.id}`} className="p-2 border border-[var(--color-border-subtle)] rounded-xl hover:bg-gray-50"><ExternalLink size={14} className="text-[var(--color-on-surface-variant)]" /></Link>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] text-center">Guardado el {fav.savedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
