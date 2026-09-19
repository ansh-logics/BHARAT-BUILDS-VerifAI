"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Coffee, Moon, Sun } from "lucide-react";
import { usePalette, Palette } from "./palette-context";
import { cn } from "@/lib/utils";

interface PaletteSwitcherProps {
  className?: string;
  variant?: "pill" | "minimal" | "dropdown";
  compact?: boolean;
}

const PALETTES: Array<{
  id: Palette;
  label: string;
  shortLabel: string;
  icon: typeof Sun;
  colorSwatch: string;
  description: string;
}> = [
  {
    id: "light",
    label: "Monochrome Light",
    shortLabel: "Light",
    icon: Sun,
    colorSwatch: "bg-white border-zinc-300 text-zinc-900",
    description: "High-contrast clean monochrome",
  },
  {
    id: "dark",
    label: "Monochrome Dark",
    shortLabel: "Dark",
    icon: Moon,
    colorSwatch: "bg-zinc-950 border-zinc-700 text-zinc-100",
    description: "Deep obsidian & silver",
  },
  {
    id: "caffeinated",
    label: "Caffeinated",
    shortLabel: "Coffee",
    icon: Coffee,
    colorSwatch: "bg-[#FAF6F0] border-[#E2D5C4] text-[#20140D]",
    description: "Dark roasted espresso & latte crema",
  },
];

export function PaletteSwitcher({ className, variant = "dropdown", compact = false }: PaletteSwitcherProps) {
  const { palette, setPalette } = usePalette();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeItem = PALETTES.find((p) => p.id === palette) || PALETTES[0];
  const ActiveIcon = activeItem.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (variant === "dropdown") {
    return (
      <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
        {compact ? (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            title={`Active theme: ${activeItem.label}. Click to change.`}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/80 hover:bg-muted text-foreground transition-all shadow-2xs cursor-pointer select-none",
              isOpen && "border-primary/50 bg-muted ring-2 ring-primary/10"
            )}
          >
            <ActiveIcon className="size-4 text-foreground" />
            <span className="sr-only">Toggle theme ({activeItem.label})</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            title={`Active theme: ${activeItem.label}. Click to change.`}
            className={cn(
              "flex h-9 items-center gap-1.5 px-3 rounded-full border border-border/70 bg-background/80 hover:bg-muted/70 text-foreground text-xs font-medium backdrop-blur-md transition-all shadow-2xs cursor-pointer select-none",
              isOpen && "border-primary/50 bg-muted/80 ring-2 ring-primary/10"
            )}
          >
            <ActiveIcon className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground hidden sm:inline">{activeItem.shortLabel}</span>
            <ChevronDown
              className={cn(
                "size-3 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180 text-foreground"
              )}
            />
          </button>
        )}

        {isOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-popover text-popover-foreground p-1.5 shadow-xl backdrop-blur-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
          >
            <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Select Palette
            </div>
            <div className="space-y-1 mt-1">
              {PALETTES.map((item) => {
                const Icon = item.icon;
                const isActive = palette === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setPalette(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center rounded-lg border shadow-2xs",
                          item.colorSwatch
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div
                          className={cn(
                            "text-[10px]",
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {isActive && <Check className="size-4 shrink-0 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("inline-flex items-center gap-1 p-1 rounded-full bg-muted/60 border border-border/80", className)}>
        {PALETTES.map((item) => {
          const Icon = item.icon;
          const isActive = palette === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPalette(item.id)}
              title={item.label}
              aria-label={item.label}
              className={cn(
                "flex size-7 items-center justify-center rounded-full transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs scale-105 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-3.5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color Palette"
      className={cn(
        "inline-flex items-center p-1 rounded-full bg-muted/60 border border-border/80 backdrop-blur-md shadow-2xs transition-all",
        className
      )}
    >
      {PALETTES.map((item) => {
        const Icon = item.icon;
        const isActive = palette === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setPalette(item.id)}
            title={item.label}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer select-none",
              isActive
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline-block">{item.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
