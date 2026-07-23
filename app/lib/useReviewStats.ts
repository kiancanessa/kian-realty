"use client";
import { useState, useEffect } from "react";

export type ReviewStats = { avg: number; count: number };

export function useReviewStats(): Record<string, ReviewStats> {
  const [stats, setStats] = useState<Record<string, ReviewStats>>({});

  useEffect(() => {
    fetch("/api/reviews/stats")
      .then(res => res.json())
      .then((data: { stats: { property_id: string; avg_rating: number; count: number }[] }) => {
        const map: Record<string, ReviewStats> = {};
        for (const row of data.stats ?? []) map[row.property_id] = { avg: row.avg_rating, count: row.count };
        setStats(map);
      })
      .catch(() => {});
  }, []);

  return stats;
}
