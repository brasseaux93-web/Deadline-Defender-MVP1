"use client";

import Link from "next/link";
import { CLIENTS, allDates } from "@/lib/caseload";
import { hoursLeft, LANE_LABEL, formatWhen } from "@/lib/format";
import { ArrowUpRight, Bell } from "lucide-react";

export default function CommandDeck() {
  const dates = allDates();
  const critical = dates.filter((d) => d.urgency === "critical");
  const folios = CLIENTS.flatMap((c) => c.folios);
  return (
    <div className="px-7 py-6 max-w-[1100px]">
      <header className="flex items-end justify-between gap-4 mb-8">
        <div>
          <div className="kicker">Command deck</div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#fff8ea] mt-1">Who needs you before sundown.</h1>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-[rgba(239,228,208,0.55)]">
            A desk for eviction, housing, medical, and benefits managers. Dates first. Then the sealed folio. Then a second chance that a court can sign.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/intake" className="btn btn-ghost">New household</Link>
          <Link href="/vault" className="btn btn-copper">Open vault</Link>
        </div>
      </header>
      <section className="panel grid grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: "Open households", value: String(CLIENTS.length), sub: "Across four practice lanes" },
          { label: "Critical dates", value: String(critical.length), sub: "Written response or lockout" },
          { label: "Hearings this week", value: String(dates.filter((d) => d.kind === "hearing").length), sub: "District & Superior" },
          { label: "Folios in motion", value: String(folios.filter((f) => f.status !== "filed").length), sub: "Draft · review · signature" },
        ].map((m) => (
          <div key={m.label} className="metric">
            <div className="text-[12px] text-[rgba(239,228,208,0.5)]">{m.label}</div>
            <div className="text-[32px] font-semibold tracking-tight text-[#fff8ea] mt-1">{m.value}</div>
            <div className="text-[11px] text-[rgba(239,228,208,0.38)]">{m.sub}</div>
          </div>
        ))}
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
        <section className="panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#fff6e6]">Lifeline · next dates</h2>
            <Link href="/calendar" className="text-[12px] text-[#c9a36a]">Full constellation</Link>
          </div>
          <div className="space-y-2">
            {dates.slice(0, 6).map((d) => {
              const person = CLIENTS.find((c) => c.id === d.clientId)!;
              return (
                <Link key={d.id} href={`/clients/${person.id}`} className="flex items-center gap-3 rounded-2xl px-3 py-3 border border-[rgba(232,220,196,0.06)] hover:bg-[rgba(239,228,208,0.04)]">
                  <div className="w-10 text-center"><div className="text-[10px] uppercase tracking-wider text-[rgba(239,228,208,0.4)]">{hoursLeft(d.at)}</div></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] text-[#fff6e6] truncate">{person.preferredName}</div>
                    <div className="text-[12px] text-[rgba(239,228,208,0.48)] truncate">{d.label}</div>
                  </div>
                  <span className={`pill pill-${d.urgency}`}>{d.urgency}</span>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#fff6e6]">Households</h2>
            <Link href="/clients" className="text-[12px] text-[#c9a36a]">Everyone</Link>
          </div>
          <div className="space-y-2">
            {CLIENTS.map((c) => (
              <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-[rgba(239,228,208,0.04)]">
                <div className="w-9 h-9 rounded-full grid place-items-center text-[11px] font-semibold bg-[rgba(201,163,106,0.15)] text-[#e8c48a] border border-[rgba(201,163,106,0.2)]">{c.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] text-[#fff6e6]">{c.preferredName}</div>
                  <div className="text-[11px] text-[rgba(239,228,208,0.42)]">{LANE_LABEL[c.practice]} {c.docket ? `· ${c.docket}` : ""}</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[rgba(239,228,208,0.3)]" />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-5 panel p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-[#e07a4c]" />
          <h2 className="text-sm font-semibold text-[#fff6e6]">Notices already armed</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {critical.map((d) => {
            const person = CLIENTS.find((c) => c.id === d.clientId)!;
            return (
              <div key={d.id} className="rounded-2xl border border-[rgba(224,122,76,0.2)] bg-[rgba(224,122,76,0.06)] p-4">
                <div className="text-[12px] text-[#ffd4c2]">{formatWhen(d.at)}</div>
                <div className="mt-1 text-[14px] text-[#fff6e6]">{person.preferredName}</div>
                <div className="text-[12px] text-[rgba(239,228,208,0.5)]">{d.label}</div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.12em] text-[rgba(239,228,208,0.4)]">Channel · {d.channel}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
