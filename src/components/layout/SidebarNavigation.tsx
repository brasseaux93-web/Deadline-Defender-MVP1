"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  CalendarDays,
  FileText,
  Zap,
} from "lucide-react";

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
    <aside className="w-56 border-r border-white/8 bg-black h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
        </div>
        <span className="text-sm font-semibold tracking-tight text-white font-sans">
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
              <Icon className="w-3.75 h-3.75 shrink-0 stroke-[1.5]" />
              {label}
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}
