"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Palette = "light" | "dark" | "caffeinated";

interface PaletteContextType {
  palette: Palette;
  setPalette: (palette: Palette) => void;
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

const STORAGE_KEY = "verifai-palette";

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Palette | null;
      if (stored && (stored === "light" || stored === "dark" || stored === "caffeinated")) {
        setPaletteState(stored);
        applyPalette(stored);
      } else {
        applyPalette("light");
      }
    } catch {
      applyPalette("light");
    }
    setMounted(true);
  }, []);

  const applyPalette = (p: Palette) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-palette", p);
    if (p === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setPalette = (newPalette: Palette) => {
    setPaletteState(newPalette);
    applyPalette(newPalette);
    try {
      localStorage.setItem(STORAGE_KEY, newPalette);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <PaletteContext.Provider value={{ palette: mounted ? palette : "light", setPalette }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
}
