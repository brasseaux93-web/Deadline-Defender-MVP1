"use client";

import Link from "next/link";
import { CLIENTS, allDates } from "@/lib/caseload";
import { formatWhen, hoursLeft } from "@/lib/format";

export default function CalendarPage() {
  const dates = allDates();
  return (
    <div className="px-7 py-6 max-w-[980px]">
      <div className="kicker">Notifications & dates</div>
      <h1 className="text-[26px] font-semibold text-[#fff8ea] mt-1 mb-2">Nothing silent on a Friday afternoon.</h1>
      <p className="text-[13.5px] text-[rgba(239,228,208,0.5)] max-w-2xl mb-6">
        Every date has a channel: court, client, counsel, or agency. Critical items pulse until someone marks the filing done.
      </p>
      <div className="space-y-2">
        {dates.map((d) => {
          const person = CLIENTS.find((c) => c.id === d.clientId)!;
          return (
            <div key={d.id} className="panel p-4 flex flex-wrap items-center gap-4">
              <div className="w-28">
                <div className={`pill pill-${d.urgency}`}>{hoursLeft(d.at)}</div>
                <div className="mt-2 text-[11px] text-[rgba(239,228,208,0.4)]">{formatWhen(d.at)}</div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Link href={`/clients/${person.id}`} className="text-[15px] text-[#fff6e6] font-medium">{person.preferredName}</Link>
                <div className="text-[13px] text-[rgba(239,228,208,0.55)]">{d.label}</div>
              </div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-[rgba(239,228,208,0.38)]">{d.kind} · {d.channel}</div>
              <button className="btn btn-ghost">Mark done</button>
              <button className="btn btn-signal">Notify</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
