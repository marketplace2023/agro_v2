"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, Filter, Package, ShoppingCart, Tag,
  Truck, AlertCircle, ChevronLeft, ChevronRight, Building2,
} from "lucide-react";

interface CatalogProduct {
  id: string;
  name: string;
  brand?: { name: string; logoUrl?: string | null } | null;
  category?: { name: string; slug: string } | null;
  imageUrl?: string | null;
  price?: number | null;
  stock?: number | null;
  deliveryDays?: number | null;
}

interface Category { id: string; name: string; slug: string }

interface CartItem { productId: string; name: string; price: number; qty: number }

export default function CatalogoPrivadoB2BPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Step 1: get user company
  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.company?.id) {
          setCompanyId(data.company.id);
          setCompanyName(data.company.commercialName ?? data.company.name ?? "");
        } else {
          setError("Tu cuenta no tiene una empresa asociada. Contacta al administrador.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("No se pudo cargar el perfil.");
        setLoading(false);
      });
  }, []);

  // Step 2: load categories
  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Step 3: load catalog when companyId is ready
  const loadCatalog = useCallback(() => {
    if (!companyId) return;
    setLoading(true);
    const params = new URLSearchParams({
      companyId,
      page: String(page),
      ...(search && { q: search }),
      ...(category && { category }),
    });
    fetch(`/api/b2b/catalogo-privado?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.pages ?? 1);
      })
      .catch(() => setError("Error al cargar el catálogo."))
      .finally(() => setLoading(false));
  }, [companyId, search, category, page]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function addToCart(product: CatalogProduct) {
    if (!product.price) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) return prev.map((i) => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: product.id, name: product.name, price: product.price!, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartQty   = cart.reduce((s, i) => s + i.qty, 0);

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <AlertCircle size={40} className="mx-auto text-orange-400" />
        <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">{error}</p>
        <Link href="/b2b/cuenta-corporativa" className="text-sm text-[var(--color-primary)] hover:underline">
          Configurar cuenta corporativa →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-headline-md font-bold">Catálogo Privado B2B</h1>
          {companyName && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-[var(--color-on-surface-variant)]">
              <Building2 size={13} /> {companyName} · Precios negociados exclusivos
            </div>
          )}
        </div>

        {/* Cart summary */}
        {cart.length > 0 && (
          <div className="flex items-center gap-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl px-4 py-2.5 shrink-0">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]">
              <ShoppingCart size={15} />
              <span>{cartQty} producto{cartQty !== 1 ? "s" : ""}</span>
            </div>
            <span className="text-sm font-bold">${cartTotal.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</span>
            <Link href="/carrito" className="text-xs font-semibold bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:opacity-90">
              Ver carrito
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar producto o marca..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
          <button type="submit" className="text-xs font-medium text-[var(--color-primary)] hover:underline shrink-0">Buscar</button>
        </form>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[var(--color-on-surface-variant)]" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        {(search || category) && (
          <button
            onClick={() => { setSearch(""); setSearchInput(""); setCategory(""); setPage(1); }}
            className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] underline"
          >
            Limpiar filtros
          </button>
        )}
        {total > 0 && (
          <p className="text-xs text-[var(--color-on-surface-variant)] ml-auto">{total} producto{total !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden animate-pulse">
              <div className="h-36 bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-5 bg-gray-100 rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const isAdded = addedId === product.id;
              const inCart = cart.find((i) => i.productId === product.id);
              const outOfStock = product.stock !== null && product.stock !== undefined && product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden flex flex-col hover:shadow-sm transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-36 bg-[var(--color-surface-container-low)] flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package size={32} className="text-[var(--color-on-surface-variant)]/30" />
                    )}
                    {outOfStock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Sin stock</span>
                      </div>
                    )}
                    {inCart && (
                      <div className="absolute top-2 right-2 bg-[var(--color-primary)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {inCart.qty}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    {product.category && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[var(--color-on-surface-variant)] mb-1">
                        <Tag size={8} /> {product.category.name}
                      </span>
                    )}
                    <p className="text-sm font-semibold leading-snug line-clamp-2 flex-1">{product.name}</p>
                    {product.brand && (
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{product.brand.name}</p>
                    )}

                    <div className="mt-2 flex items-end justify-between gap-1">
                      <div>
                        {product.price ? (
                          <p className="text-base font-bold text-[var(--color-primary)]">
                            ${product.price.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                          </p>
                        ) : (
                          <p className="text-xs text-[var(--color-on-surface-variant)] italic">Precio a consultar</p>
                        )}
                        {product.deliveryDays && (
                          <p className="text-[10px] text-[var(--color-on-surface-variant)] flex items-center gap-0.5 mt-0.5">
                            <Truck size={8} /> {product.deliveryDays}d entrega
                          </p>
                        )}
                      </div>
                      {product.stock !== null && product.stock !== undefined && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          outOfStock ? "bg-red-50 text-red-600" :
                          product.stock < 20 ? "bg-orange-50 text-orange-600" :
                          "bg-green-50 text-green-600"
                        }`}>
                          {outOfStock ? "Sin stock" : `${product.stock} disp.`}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={!product.price || outOfStock}
                      onClick={() => addToCart(product)}
                      className={`mt-3 w-full text-xs font-semibold py-2 rounded-lg transition-all ${
                        isAdded
                          ? "bg-green-500 text-white"
                          : !product.price || outOfStock
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[var(--color-primary)] text-white hover:opacity-90"
                      }`}
                    >
                      {isAdded ? "¡Agregado!" : !product.price ? "Consultar precio" : outOfStock ? "Sin stock" : "Agregar al carrito"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-[var(--color-border-subtle)] rounded-xl px-4 py-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 text-sm font-medium disabled:opacity-40 hover:text-[var(--color-primary)]"
              >
                <ChevronLeft size={15} /> Anterior
              </button>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{totalPages}</span>
              </p>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 text-sm font-medium disabled:opacity-40 hover:text-[var(--color-primary)]"
              >
                Siguiente <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-20 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]">
          <Package size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No hay productos en tu catálogo privado</p>
          <p className="text-xs mt-1 max-w-xs mx-auto">
            Los productos aparecen aquí cuando un proveedor activa una lista de precios para tu empresa.
            {search || category
              ? " Prueba cambiando los filtros."
              : " Contacta a tu ejecutivo de cuenta."}
          </p>
          {(search || category) && (
            <button
              onClick={() => { setSearch(""); setSearchInput(""); setCategory(""); setPage(1); }}
              className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
