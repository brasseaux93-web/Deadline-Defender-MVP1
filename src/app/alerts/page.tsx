"use client";

import { CLIENTS, allDates } from "@/lib/caseload";
import { formatWhen } from "@/lib/format";

const CHANNELS = {
  court: "E-file reminder + clerk confirmation",
  client: "SMS + voice note in preferred language",
  counsel: "Advocate slack / email pulse",
  agency: "Case-manager handoff",
};

export default function AlertsPage() {
  const dates = allDates().filter((d) => d.urgency === "critical" || d.urgency === "soon");
  return (
    <div className="px-7 py-6 max-w-[860px]">
      <div className="kicker">Notification desk</div>
      <h1 className="text-[26px] font-semibold text-[#fff8ea] mt-1 mb-2">Tell the right person, once, on time.</h1>
      <p className="text-[13.5px] text-[rgba(239,228,208,0.5)] mb-6">
        Notices are not marketing. They are the difference between a written answer and a default.
      </p>
      <div className="space-y-3">
        {dates.map((d) => {
          const person = CLIENTS.find((c) => c.id === d.clientId)!;
          return (
            <div key={d.id} className="panel p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[15px] text-[#fff6e6]">{person.preferredName}</div>
                  <div className="text-[13px] text-[rgba(239,228,208,0.55)]">{d.label}</div>
                  <div className="text-[11px] text-[rgba(239,228,208,0.38)] mt-1">{formatWhen(d.at)} · {CHANNELS[d.channel]}</div>
                </div>
                <button className="btn btn-signal">Send now</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
