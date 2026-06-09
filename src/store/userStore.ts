"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
  country: string;
  language: "es" | "en" | "pt";
  currency: string;
  favoriteCategories: string[];
  favoriteCrops: string[];
}

interface UserState {
  preferences: UserPreferences;
  recentlyViewed: string[];
  savedForLater: string[];

  setCountry: (country: string) => void;
  setLanguage: (lang: "es" | "en" | "pt") => void;
  setCurrency: (currency: string) => void;
  addFavoriteCategory: (slug: string) => void;
  removeFavoriteCategory: (slug: string) => void;
  addFavoriteCrop: (slug: string) => void;
  removeFavoriteCrop: (slug: string) => void;
  addRecentlyViewed: (productId: string) => void;
  addSavedForLater: (productId: string) => void;
  removeSavedForLater: (productId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      preferences: {
        country: "CO",
        language: "es",
        currency: "USD",
        favoriteCategories: [],
        favoriteCrops: [],
      },
      recentlyViewed: [],
      savedForLater: [],

      setCountry(country) {
        set((s) => ({ preferences: { ...s.preferences, country } }));
      },

      setLanguage(language) {
        set((s) => ({ preferences: { ...s.preferences, language } }));
      },

      setCurrency(currency) {
        set((s) => ({ preferences: { ...s.preferences, currency } }));
      },

      addFavoriteCategory(slug) {
        set((s) => ({
          preferences: {
            ...s.preferences,
            favoriteCategories: [
              ...new Set([...s.preferences.favoriteCategories, slug]),
            ],
          },
        }));
      },

      removeFavoriteCategory(slug) {
        set((s) => ({
          preferences: {
            ...s.preferences,
            favoriteCategories: s.preferences.favoriteCategories.filter(
              (c) => c !== slug
            ),
          },
        }));
      },

      addFavoriteCrop(slug) {
        set((s) => ({
          preferences: {
            ...s.preferences,
            favoriteCrops: [
              ...new Set([...s.preferences.favoriteCrops, slug]),
            ],
          },
        }));
      },

      removeFavoriteCrop(slug) {
        set((s) => ({
          preferences: {
            ...s.preferences,
            favoriteCrops: s.preferences.favoriteCrops.filter(
              (c) => c !== slug
            ),
          },
        }));
      },

      addRecentlyViewed(productId) {
        set((s) => {
          const updated = [
            productId,
            ...s.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 20);
          return { recentlyViewed: updated };
        });
      },

      addSavedForLater(productId) {
        set((s) => ({
          savedForLater: [...new Set([...s.savedForLater, productId])],
        }));
      },

      removeSavedForLater(productId) {
        set((s) => ({
          savedForLater: s.savedForLater.filter((id) => id !== productId),
        }));
      },
    }),
    {
      name: "agro-user",
    }
  )
);
