import { ReactNode } from "react";
import { CommandRail } from "./CommandRail";
import { ResourceRail } from "./ResourceRail";
import { CommandPalette } from "./CommandPalette";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <CommandRail />
      <main className="min-w-0 h-screen overflow-y-auto">
        {children}
      </main>
      <ResourceRail />
      <CommandPalette />
    </div>
  );
}
