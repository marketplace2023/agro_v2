"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  brand: string;
  imageUrl?: string | null;
  price: number;
  currency: string;
  unit: string;
  quantity: number;
  vendorId: string;
  vendorName: string;
  isRegulated?: boolean;
  country?: string;
}

interface CartState {
  items: CartItem[];
  country: string;
  coupon: string | null;
  couponDiscount: number;

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCountry: (country: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  totalByVendor: () => Record<string, { vendorName: string; subtotal: number }>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      country: "CO",
      coupon: null,
      couponDiscount: 0,

      addItem(newItem) {
        const quantity = newItem.quantity ?? 1;
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity }] };
        });
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity(id, quantity) {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart() {
        set({ items: [], coupon: null, couponDiscount: 0 });
      },

      setCountry(country) {
        set({ country });
      },

      applyCoupon(code, discount) {
        set({ coupon: code, couponDiscount: discount });
      },

      removeCoupon() {
        set({ coupon: null, couponDiscount: 0 });
      },

      itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      totalByVendor() {
        return get().items.reduce(
          (acc, item) => {
            if (!acc[item.vendorId]) {
              acc[item.vendorId] = { vendorName: item.vendorName, subtotal: 0 };
            }
            acc[item.vendorId].subtotal += item.price * item.quantity;
            return acc;
          },
          {} as Record<string, { vendorName: string; subtotal: number }>
        );
      },
    }),
    {
      name: "agro-cart",
      partialize: (state) => ({
        items: state.items,
        country: state.country,
        coupon: state.coupon,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);
