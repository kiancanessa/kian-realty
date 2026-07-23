"use client";
import { createContext, useContext, ReactNode } from "react";
import { useFavorites, Favorite } from "./useFavorites";

type FavoritesContextType = {
  favorites: Favorite[];
  loading: boolean;
  isFavorited: (propertyId: string) => boolean;
  toggle: (propertyId: string, propertyTitle?: string, propertyImage?: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const value = useFavorites();
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavoritesContext must be used inside FavoritesProvider");
  return ctx;
}
