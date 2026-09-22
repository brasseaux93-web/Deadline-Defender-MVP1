import { ReactNode } from "react";
import { SidebarNavigation } from "./SidebarNavigation";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden">
      <SidebarNavigation />
      {/* Main content — flat continuous canvas */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-black relative">
        {children}
      </main>
    </div>
  );
}
