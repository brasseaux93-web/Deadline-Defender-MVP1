"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  CalendarDays,
  FileText,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cases", label: "Cases", icon: FolderOpen },
  { href: "/deadlines", label: "Deadlines", icon: CalendarDays },
  { href: "/documents", label: "Documents & Templates", icon: FileText },
  { href: "/intake", label: "Emergency Intake", icon: Zap },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-white/[0.08] bg-black h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs leading-none select-none">
          D
        </div>
        <span className="text-[14px] font-medium tracking-tight text-white">
          Deadline Defenders
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 active:outline-none select-none",
                isActive
                  ? "bg-zinc-900 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent",
              ].join(" ")}
            >
              <Icon className="w-[15px] h-[15px] shrink-0 stroke-[1.5]" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Divider + Quick Intake */}
      <div className="px-3 pb-6">
        <div className="border-t border-zinc-800 pt-4">
          <Link href="/intake" className="block w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 font-medium text-sm py-2 px-4 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 active:outline-none select-none">
              <Zap className="w-4 h-4" />
              Quick Intake
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
