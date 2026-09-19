"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart3, Settings, Search, FolderKanban, BrainCircuit } from "lucide-react";
import { clearTpoAuth, getStoredTpoUsername } from "@/lib/auth-storage";
import { PaletteSwitcher } from "@/components/theme/palette-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/tpo", icon: Home },
  { name: "AI Search", href: "/tpo/ai-search", icon: Search },
  { name: "Placement Groups", href: "/tpo/placement-groups", icon: FolderKanban },
  { name: "Reports", href: "/tpo/reports", icon: BarChart3 },
  { name: "Settings", href: "/tpo/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const username = getStoredTpoUsername();

  function signOut() {
    clearTpoAuth();
    router.replace("/tpo/login");
  }

  return (
    <aside className="w-64 flex-shrink-0 p-4 border-r border-sidebar-border flex flex-col gap-6 relative z-0 bg-sidebar text-sidebar-foreground transition-colors">
      <div className="flex items-center gap-2.5 px-2 mt-2 relative z-10">
        <div className="size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
          <BrainCircuit className="size-4" />
        </div>
        <span className="font-bold text-lg tracking-tight text-sidebar-foreground">VerifAI</span>
      </div>

      <nav className="flex flex-col gap-1 relative z-10 mt-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/tpo" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className={cn("size-4", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto relative z-10 px-2 space-y-4 pt-4 border-t border-sidebar-border">
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Theme Palette</div>
          <PaletteSwitcher variant="minimal" />
        </div>

        <div className="text-xs text-muted-foreground">
          Signed in as <span className="text-sidebar-foreground font-semibold">{username || "tpo"}</span>
        </div>

        <button
          onClick={signOut}
          className="w-full rounded-xl border border-sidebar-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
