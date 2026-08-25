"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { cities } from "@/lib/data/categories";

interface LocationContextValue {
  city: string;
  setCity: (city: string) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);
const STORAGE_KEY = "presou-city-v1";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<string>(cities[0]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setCityState(saved);
  }, []);

  const setCity = (c: string) => {
    setCityState(c);
    localStorage.setItem(STORAGE_KEY, c);
  };

  return <LocationContext.Provider value={{ city, setCity }}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}
