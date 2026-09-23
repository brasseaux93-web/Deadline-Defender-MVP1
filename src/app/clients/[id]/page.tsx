"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getClient } from "@/lib/caseload";
import { formatWhen, hoursLeft, LANE_LABEL } from "@/lib/format";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ClientDossier() {
  const params = useParams<{ id: string }>();
  const client = getClient(params.id);
  if (!client) return <div className="px-7 py-10 text-[rgba(239,228,208,0.5)]">Household not in the vault.</div>;
  return (
    <div className="px-7 py-6 max-w-[1100px]">
      <Link href="/clients" className="text-[12px] text-[rgba(239,228,208,0.45)]">← People</Link>
      <header className="mt-3 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kicker">{LANE_LABEL[client.practice]}</div>
          <h1 className="text-[30px] font-semibold tracking-tight text-[#fff8ea]">{client.preferredName}</h1>
          <p className="text-[13px] text-[rgba(239,228,208,0.48)]">Legal name {client.legalName}{client.docket ? ` · ${client.docket}` : ""}{client.court ? ` · ${client.court}` : ""}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/vault?client=${client.id}`} className="btn btn-copper">Draft an instrument</Link>
          <Link href="/calendar" className="btn btn-ghost">See dates</Link>
        </div>
      </header>
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          <section className="panel p-5">
            <div className="kicker mb-2">The human file</div>
            <p className="text-[15px] leading-relaxed text-[#f3ead8]">{client.story}</p>
            <div className="mt-4 rounded-2xl border border-[rgba(143,186,154,0.2)] bg-[rgba(143,186,154,0.08)] p-4">
              <div className="kicker" style={{ color: "#8fba9a" }}>Second chance</div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#e5f0e7]">{client.secondChance}</p>
            </div>
          </section>
          <section className="panel p-5">
            <div className="kicker mb-4">Date constellation</div>
            <div className="constellation flex gap-3 overflow-x-auto pb-2">
              {client.dates.map((d) => (
                <div key={d.id} className="min-w-[180px] rounded-2xl border border-[rgba(232,220,196,0.08)] p-3 bg-[rgba(0,0,0,0.15)]">
                  <div className={`pill pill-${d.urgency} mb-2`}>{hoursLeft(d.at)}</div>
                  <div className="text-[13px] text-[#fff6e6]">{d.label}</div>
                  <div className="text-[11px] text-[rgba(239,228,208,0.42)] mt-1">{formatWhen(d.at)}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="kicker">Safety vault</div>
              <Link href={`/vault?client=${client.id}`} className="text-[12px] text-[#c9a36a]">Compose</Link>
            </div>
            <div className="space-y-2">
              {client.folios.length === 0 && <p className="text-[13px] text-[rgba(239,228,208,0.45)]">No folios yet. Intake is the first seal.</p>}
              {client.folios.map((f) => (
                <Link key={f.id} href={`/vault?client=${client.id}&kind=${f.kind}`} className="folio">
                  <div className="wax">{f.status.slice(0, 3).toUpperCase()}</div>
                  <div>
                    <div className="text-[14px] text-[#fff6e6]">{f.title}</div>
                    <div className="text-[11px] text-[rgba(239,228,208,0.42)]">{f.authority} · {f.pages} pg · {f.status}</div>
                  </div>
                  <span className="pill">{f.sealed ? "Sealed" : "Open"}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-4">
          <div className="panel p-4 space-y-3">
            <div className="kicker">Reach</div>
            <div className="flex items-center gap-2 text-[13px] text-[rgba(239,228,208,0.7)]"><Phone className="w-3.5 h-3.5 text-[#c9a36a]" /> {client.phone}</div>
            <div className="flex items-center gap-2 text-[13px] text-[rgba(239,228,208,0.7)]"><Mail className="w-3.5 h-3.5 text-[#c9a36a]" /> {client.email}</div>
            <div className="flex items-start gap-2 text-[13px] text-[rgba(239,228,208,0.7)]"><MapPin className="w-3.5 h-3.5 text-[#c9a36a] mt-0.5" /><span>{client.address}<br />{client.city}, WA {client.zip}</span></div>
          </div>
          <div className="panel p-4">
            <div className="kicker mb-2">Household</div>
            <ul className="space-y-2">
              {client.household.map((h) => (
                <li key={h.name} className="text-[13px] text-[#f3ead8]">{h.name}<div className="text-[11px] text-[rgba(239,228,208,0.4)]">{h.relation}{h.age ? ` · ${h.age}` : ""}</div></li>
              ))}
            </ul>
          </div>
          {(client.landlord || client.judge) && (
            <div className="panel p-4 space-y-2 text-[13px] text-[rgba(239,228,208,0.7)]">
              <div className="kicker">Court file</div>
              {client.landlord && <div>Plaintiff · {client.landlord}</div>}
              {client.judge && <div>{client.judge} · {client.courtroom}</div>}
              {client.noticeType && <div className="text-[12px] leading-relaxed">{client.noticeType}</div>}
              {client.arrears && <div>Claimed arrears · {client.arrears}</div>}
            </div>
          )}
          {client.medicalNotes && (
            <div className="panel p-4">
              <div className="kicker mb-2">Need-to-know clinical</div>
              <p className="text-[12.5px] leading-relaxed text-[rgba(239,228,208,0.65)]">{client.medicalNotes}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
