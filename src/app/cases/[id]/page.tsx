"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { LiquidGlassSurface } from "@/components/ui/LiquidGlassSurface";
import { DocumentDrawer } from "@/components/ui/DocumentGenerator";

// In a real app, this would be fetched from a database using the ID
const mockCaseData = {
  tenantName: "Maria Gonzalez",
  caseNumber: "24-2-09841-7",
  landlordName: "Lakeview Properties LLC",
  noticeType: "3-Day Pay or Vacate",
  arrearsAmount: "$2,450.00",
  propertyAddress: "2847 Rainier Ave S, Seattle, WA 98144",
  hearingDate: "Sep 18, 2026 · 9:00 AM",
  status: "Active",
  urgency: "High",
};

export default function CaseView() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="pb-24 space-y-5">
        <header className="space-y-4">
          <Link
            href="/cases"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-fit"
          >
            <ArrowLeft className="w-3 h-3" />
            Cases
          </Link>

          <div className="flex items-end justify-between border-b border-[#27272a] pb-4">
            <div>
              <h1 className="text-xl font-semibold tracking-[-0.03em] text-zinc-100">
                {mockCaseData.tenantName}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2 font-mono">
                <span>{mockCaseData.caseNumber}</span>
                <span className="text-zinc-700">·</span>
                <span className="font-sans text-zinc-500">{mockCaseData.propertyAddress}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                {mockCaseData.status}
              </span>
              <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20">
                {mockCaseData.urgency} Urgency
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Case Details sidebar */}
          <div className="lg:col-span-1">
            <LiquidGlassSurface className="p-4">
              <h2 className="text-sm font-medium tracking-tight text-zinc-200 mb-3">
                Case Details
              </h2>
              <dl className="space-y-3">
                {[
                  { label: "Hearing Date", value: mockCaseData.hearingDate },
                  { label: "Landlord", value: mockCaseData.landlordName },
                  { label: "Notice Type", value: mockCaseData.noticeType },
                  { label: "Arrears", value: mockCaseData.arrearsAmount },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="micro-label mb-0.5">{label}</dt>
                    <dd className="text-xs text-zinc-300">{value}</dd>
                  </div>
                ))}
              </dl>
            </LiquidGlassSurface>
          </div>

          {/* Document generator prompt */}
          <div className="lg:col-span-2">
            <LiquidGlassSurface className="p-4 flex flex-col gap-3">
              <h2 className="text-sm font-medium tracking-tight text-zinc-200">
                Document Generator
              </h2>
              <p className="text-xs text-zinc-500 max-w-md">
                Generate court-ready pleadings using Groq AI. Select a template (Answer &
                Affirmative Defenses, Motion to Stay, or Hardship Declaration) and stream
                the draft in real time.
              </p>
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 self-start px-3 py-1.5 rounded-md bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Open Document Generator
              </button>
            </LiquidGlassSurface>
          </div>
        </div>
      </div>

      <DocumentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialCase={{
          caseNumber: mockCaseData.caseNumber,
          tenantName: mockCaseData.tenantName,
          landlordName: mockCaseData.landlordName,
          noticeType: mockCaseData.noticeType,
          arrearsAmount: mockCaseData.arrearsAmount,
        }}
      />
    </>
  );
}
