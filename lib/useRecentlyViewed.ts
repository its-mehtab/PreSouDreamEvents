"use client";

import { useEffect, useState } from "react";

const KEY = "presou-recently-viewed";

export function recordView(productId: string) {
  try {
    const raw = localStorage.getItem(KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const next = [productId, ...ids.filter((id) => id !== productId)].slice(0, 12);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function useRecentlyViewed(excludeId?: string) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: string[] = raw ? JSON.parse(raw) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIds(parsed.filter((id) => id !== excludeId));
    } catch {
      setIds([]);
    }
  }, [excludeId]);

  return ids;
}
