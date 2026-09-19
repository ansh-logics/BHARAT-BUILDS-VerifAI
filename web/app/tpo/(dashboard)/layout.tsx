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
    <div className="flex h-screen w-full bg-background text-foreground font-sans selection:bg-primary/20 overflow-hidden transition-colors">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
