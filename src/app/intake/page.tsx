"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntakePage() {
  const router = useRouter();
  const [lane, setLane] = useState("eviction");
  return (
    <div className="px-7 py-6 max-w-[760px]">
      <div className="kicker">Emergency intake</div>
      <h1 className="text-[26px] font-semibold text-[#fff8ea] mt-1 mb-2">Start with the person at the counter.</h1>
      <p className="text-[13.5px] text-[rgba(239,228,208,0.5)] mb-6">Four lanes, one vault. Capture the dates that can end a tenancy.</p>
      <form className="panel p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/clients/maria-gonzalez"); }}>
        <div className="grid grid-cols-2 gap-2">
          {["eviction", "housing", "medical", "benefits"].map((l) => (
            <button key={l} type="button" onClick={() => setLane(l)} className={`pill capitalize ${lane === l ? "pill-soon" : ""}`}>{l}</button>
          ))}
        </div>
        <label className="block text-[12px] text-[rgba(239,228,208,0.5)]">Legal name<input className="field mt-1" required placeholder="As it should appear on the caption" /></label>
        <label className="block text-[12px] text-[rgba(239,228,208,0.5)]">Address<input className="field mt-1" placeholder="Street, city, ZIP" /></label>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="block text-[12px] text-[rgba(239,228,208,0.5)]">Phone<input className="field mt-1" /></label>
          <label className="block text-[12px] text-[rgba(239,228,208,0.5)]">First hard date<input className="field mt-1" type="datetime-local" /></label>
        </div>
        {lane === "eviction" && (
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block text-[12px] text-[rgba(239,228,208,0.5)]">Docket<input className="field mt-1" placeholder="24-2-00000-0" /></label>
            <label className="block text-[12px] text-[rgba(239,228,208,0.5)]">Notice in hand<select className="field mt-1"><option>14-Day Pay or Vacate</option><option>10-Day Comply or Vacate</option><option>Unlawful Detainer Summons</option><option>Writ of Restitution posted</option></select></label>
          </div>
        )}
        <label className="block text-[12px] text-[rgba(239,228,208,0.5)]">Why they are here<textarea className="field mt-1 min-h-[90px]" /></label>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => router.push("/")}>Cancel</button>
          <button className="btn btn-copper" type="submit">Seal intake into vault</button>
        </div>
      </form>
    </div>
  );
}
