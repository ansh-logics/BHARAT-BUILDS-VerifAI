"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { getStoredTpoToken } from "@/lib/auth-storage";

export default function TpoLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredTpoToken();
    if (!token) {
      router.replace("/tpo/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full bg-sidebar text-sidebar-foreground font-sans selection:bg-primary/20 overflow-hidden transition-colors">
      <Sidebar />
      <main className="flex-1 bg-background text-foreground rounded-[2rem] border border-border/80 flex flex-col relative z-50 shadow-sm my-2.5 mr-2.5 overflow-hidden transition-colors">
        {children}
      </main>
    </div>
  );
}
