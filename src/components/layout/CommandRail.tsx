"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarRange,
  LayoutDashboard,
  Shield,
  Sparkles,
  Users,
  Vault,
} from "lucide-react";

const ITEMS = [
  { href: "/", label: "Command", icon: LayoutDashboard },
  { href: "/clients", label: "People", icon: Users },
  { href: "/calendar", label: "Dates", icon: CalendarRange },
  { href: "/vault", label: "Vault", icon: Vault },
  { href: "/intake", label: "Intake", icon: Sparkles },
  { href: "/alerts", label: "Notices", icon: Bell },
];

export function CommandRail() {
  const pathname = usePathname();

  return (
    <aside className="rail flex flex-col border-r h-screen px-3 py-5">
      <Link href="/" className="flex items-center gap-3 px-2 mb-8">
        <div className="mark">
          <span>D</span>
        </div>
        <div className="hide-compact">
          <div className="text-[13px] font-semibold tracking-tight text-[#fff6e6]">
            Deadline Defender
          </div>
          <div className="text-[10px] text-[rgba(239,228,208,0.45)] tracking-[0.14em] uppercase">
            Continuance Vault
          </div>
        </div>
      </Link>
      <nav className="flex-1 space-y-1">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-link ${active ? "is-active" : ""}`}>
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />
              <span className="hide-compact">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hide-compact mx-1 mt-3 rounded-2xl border border-[rgba(232,220,196,0.08)] p-3 bg-[rgba(239,228,208,0.03)]">
        <div className="flex items-center gap-2 text-[11px] text-[rgba(239,228,208,0.55)]">
          <Shield className="w-3.5 h-3.5 text-[#c9a36a]" />
          Vault sealed · local draft
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-[rgba(239,228,208,0.42)]">
          Instruments stay with the household file. Generated pleadings are advocate drafts for licensed review.
        </p>
      </div>
    </aside>
  );
}
