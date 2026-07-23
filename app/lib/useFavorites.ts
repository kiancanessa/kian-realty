"use client";
import { useState, useEffect, useCallback } from "react";

export type Favorite = { property_id: string; property_title: string | null; property_image: string | null; created_at: string };

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    return fetch("/api/favorites")
      .then(res => res.json())
      .then(data => setFavorites(data.favorites ?? []))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isFavorited = (propertyId: string) => favorites.some(f => f.property_id === propertyId);

  const toggle = async (propertyId: string, propertyTitle?: string, propertyImage?: string) => {
    if (isFavorited(propertyId)) {
      setFavorites(prev => prev.filter(f => f.property_id !== propertyId));
      await fetch(`/api/favorites/${encodeURIComponent(propertyId)}`, { method: "DELETE" });
    } else {
      setFavorites(prev => [{ property_id: propertyId, property_title: propertyTitle ?? null, property_image: propertyImage ?? null, created_at: new Date().toISOString() }, ...prev]);
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, propertyTitle, propertyImage }),
      });
    }
  };

  return { favorites, loading, isFavorited, toggle, refresh: load };
}
