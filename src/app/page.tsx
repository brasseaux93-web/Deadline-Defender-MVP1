"use client";

import { useState, useEffect } from "react";
import { DocumentDrawer } from "@/components/ui/DocumentGenerator";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock, TrendingDown, ClipboardCopy, FileText, CheckCircle2, AlertTriangle, PlayCircle, ChevronDown, Activity } from "lucide-react";
import { motion } from "framer-motion";

// ─── Demo Data ───────────────────────────────────────────────────────────────

type UrgencyTier = "CRITICAL // TODAY" | "UPCOMING // 48 HOURS";

interface DeadlineItem {
  id: string;
  tier: UrgencyTier;
  docket: string;
  tenant: string;
  court: string;
  deadline: string;
  countdown: string;
  action: "Draft Motion" | "File Answer" | "File Declaration" | "Prepare Hearing";
  advocate: string;
  grounds: string;
}

const DEADLINES: DeadlineItem[] = [
  { id: "d1", tier: "CRITICAL // TODAY", docket: "24-2-09841-7", tenant: "Maria Gonzalez", court: "KC District", deadline: "Today 5:00 PM", countdown: "3h 42m remaining", action: "File Answer", advocate: "RC", grounds: "RCW 59.18.365 · 14-Day Notice Defect" },
  { id: "d2", tier: "CRITICAL // TODAY", docket: "24-2-10023-1", tenant: "James Okafor", court: "KC Superior", deadline: "Today 4:30 PM", countdown: "3h 12m remaining", action: "Draft Motion", advocate: "AP", grounds: "RCW 59.12.030 · Unlawful Detainer" },
  { id: "d3", tier: "UPCOMING // 48 HOURS", docket: "24-2-08812-4", tenant: "Linh Tran", court: "KC District", deadline: "Thu Sep 18 · 9:00 AM", countdown: "1d 18h remaining", action: "File Declaration", advocate: "MW", grounds: "RCW 59.18.410 · Payment Plan Proposal" },
];

export type DocStatus = "Drafted" | "Review" | "Signature" | "Filed" | "N/A";

export interface CaseRow {
  id: string;
  tenant: string;
  phone: string;
  caseNumber: string;
  judge: string;
  courtroom: string;
  hearing: string;
  advocate: string;
  docs: { answer: DocStatus; stay: DocStatus; declaration: DocStatus };
  arrears: string;
}

const CASES: CaseRow[] = [
  { id: "c1", tenant: "Maria Gonzalez", phone: "(206) 555-0192", caseNumber: "24-2-09841-7", judge: "Judge Roberts", courtroom: "Courtroom W-728", hearing: "Sep 18 · 9:00 AM", advocate: "R. Chen", docs: { answer: "Filed", stay: "Drafted", declaration: "Review" }, arrears: "$2,450.00" },
  { id: "c2", tenant: "James Okafor", phone: "(253) 555-0104", caseNumber: "24-2-10023-1", judge: "Judge Smith", courtroom: "Courtroom E-302", hearing: "Sep 19 · 1:30 PM", advocate: "A. Patel", docs: { answer: "Drafted", stay: "Drafted", declaration: "Signature" }, arrears: "$3,800.00" },
  { id: "c3", tenant: "Linh Tran", phone: "(425) 555-0177", caseNumber: "24-2-08812-4", judge: "Judge Davis", courtroom: "Courtroom W-944", hearing: "Sep 22 · 10:00 AM", advocate: "M. Williams", docs: { answer: "Filed", stay: "N/A", declaration: "Filed" }, arrears: "$1,200.00" },
];

const DOC_COORD = [
  { id: "dc1", label: "Notice of Appearance", tenant: "Gonzalez", stage: "Filed", meta: "PDF · 1 pg · E-Filed" },
  { id: "dc2", label: "Tenant Declaration", tenant: "Okafor", stage: "Signature", meta: "PDF · 3 pgs · Groq Verified" },
  { id: "dc4", label: "Motion to Stay", tenant: "Gonzalez", stage: "Drafted", meta: "PDF · 2 pgs · AI Gen" },
];

const METRICS = [
  { label: "Active Caseload", value: "14", sub: "King County Superior: 8 · District: 6" },
  { label: "Critical <24h", value: "3", sub: "Requires Immediate Action", urgent: true },
  { label: "Hearings This Wk", value: "7", sub: "Mon - Fri Schedule" },
  { label: "Pending Filings", value: "5", sub: "Awaiting Court Acceptance" },
];

interface DrawerState {
  isOpen: boolean;
  caseRow?: CaseRow;
  defaultTemplate?: "Answer & Affirmative Defenses (RCW 59.18)" | "Motion to Stay Execution of Writ of Restitution" | "Tenant Hardship Declaration & Payment Plan Proposal";
}

// ─── Formatting Helpers ──────────────────────────────────────────────────────
const interactiveRow = "transition-all duration-200 cursor-pointer hover:brightness-125";

// Helper for exact tailwind compilation
const getCardStyles = (color: string) => {
  switch (color) {
    case 'red': return { wrapper: "border-red-900/30", bg: "from-red-950/40", badge: "bg-red-500/10 ring-red-500/20 text-red-500", text: "text-red-500" };
    case 'orange': return { wrapper: "border-orange-900/30", bg: "from-orange-950/40", badge: "bg-orange-500/10 ring-orange-500/20 text-orange-500", text: "text-orange-500" };
    case 'blue': return { wrapper: "border-blue-900/30", bg: "from-blue-950/40", badge: "bg-blue-500/10 ring-blue-500/20 text-blue-500", text: "text-blue-500" };
    case 'emerald': return { wrapper: "border-emerald-900/30", bg: "from-emerald-950/40", badge: "bg-emerald-500/10 ring-emerald-500/20 text-emerald-500", text: "text-emerald-500" };
    default: return { wrapper: "border-zinc-800", bg: "from-zinc-900/40", badge: "bg-zinc-800 border border-zinc-700 text-zinc-400", text: "text-zinc-400" };
  }
};

const AmbientGlow = ({ colorClass }: { colorClass: string }) => (
  <motion.div
    className={`absolute inset-0 pointer-events-none -z-10 ${colorClass}`}
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

// ─── Page Component ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const [drawer, setDrawer] = useState<DrawerState>({ isOpen: false });
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by only rendering client-side content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const openDrawer = (caseNumber: string, action?: DeadlineItem["action"]) => {
    const caseRow = CASES.find((c) => c.caseNumber === caseNumber);
    if (!caseRow) return;

    let defaultTemplate: DrawerState["defaultTemplate"] = "Answer & Affirmative Defenses (RCW 59.18)";
    if (action === "Draft Motion") defaultTemplate = "Motion to Stay Execution of Writ of Restitution";
    if (action === "File Declaration") defaultTemplate = "Tenant Hardship Declaration & Payment Plan Proposal";
    
    setDrawer({ isOpen: true, caseRow, defaultTemplate });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!mounted) return null; // Hydration fix

  return (
    <>
      <div className="flex flex-col text-zinc-50 px-8 pb-12 gap-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 flex items-center justify-between shrink-0 py-8 -mx-8 px-8 bg-black">
          <h1 className="text-2xl font-semibold tracking-tight font-sans text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300"></span>
              </span>
              <span className="font-sans text-xs text-zinc-300 font-medium tracking-tight uppercase">King County Sync Active</span>
            </div>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >

        {/* ── Section 1: Unified Metrics Ribbon (Vercel Style) ── */}
        <section className="grid grid-cols-4 gap-6 shrink-0">
          {METRICS.map((m) => (
            <div key={m.label} className="flex flex-col gap-1 border-l border-white/10 pl-6">
              <span className="text-sm font-medium text-zinc-400 font-sans">
                {m.label}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-semibold tracking-tight text-white font-sans">
                  {m.value}
                </span>
                {m.urgent && <TrendingDown className="w-4 h-4 text-zinc-500" />}
              </div>
              <span className="text-xs text-zinc-500 font-sans mt-1">{m.sub}</span>
            </div>
          ))}
        </section>

        {/* ── Section 2: Middle Split ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 shrink-0 mt-12">
          
          {/* Left: Deadline Triage */}
          <div className="flex flex-col">
            <div className="px-1 mb-6 h-6 flex items-end">
              <h2 className="text-sm font-semibold tracking-tight text-white truncate">Deadline Triage</h2>
            </div>
              
            <div className="space-y-3">
                {(DEADLINES || []).map((d) => {
                  const color = d.tier.includes('CRITICAL') ? 'red' : 'zinc';
                  const styles = getCardStyles(color);
                  return (
                  <div key={d.id} className={`relative border ${styles.wrapper} rounded-xl overflow-hidden bg-black p-4 ${interactiveRow}`}>
                    {/* Ambient Volumetric Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} to-black pointer-events-none`} />
                    
                    {/* Card Content (Elevated above the background) */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-full ${styles.badge} ring-1 flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className={`text-[9px] font-bold ${styles.text}`}>{d.advocate}</span>
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-mono tnum text-xs text-white font-medium truncate tracking-tight">{d.docket}</span>
                            <span className="text-zinc-600 text-xs shrink-0">·</span>
                            <span className="text-xs text-zinc-400 truncate tracking-tight">{d.tenant}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400 truncate tracking-tight">{d.grounds}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ring-1 ${styles.badge}`}>
                          {d.tier.includes('CRITICAL') && <Clock className={`w-3 h-3 ${styles.text} animate-pulse shrink-0`} />}
                          <span className={`font-mono tnum text-[10px] whitespace-nowrap ${styles.text}`}>{d.countdown}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium font-mono tnum whitespace-nowrap tracking-tight">{d.deadline} · {d.court}</span>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
          </div>

          {/* Right: Document Coordination */}
          <div className="flex flex-col">
            <div className="px-1 mb-6 h-6 flex items-end">
              <h2 className="text-sm font-semibold tracking-tight text-white truncate">Document Coordination Pipeline</h2>
            </div>
              
            <div className="space-y-3">
                {(DOC_COORD || []).map((doc) => {
                  let color = 'zinc';
                  if (doc.stage === 'Filed') color = 'emerald';
                  else if (doc.stage === 'Drafted') color = 'blue';
                  else if (doc.stage === 'Signature' || doc.stage === 'Review') color = 'orange';
                  const styles = getCardStyles(color);

                  return (
                  <div key={doc.id} className={`relative border ${styles.wrapper} rounded-xl overflow-hidden bg-black p-4 ${interactiveRow}`}>
                    {/* Ambient Volumetric Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} to-black pointer-events-none`} />
                    
                    {/* Card Content (Elevated above the background) */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-full ${styles.badge} ring-1 flex items-center justify-center shrink-0 mt-0.5`}>
                          {doc.stage === 'Filed' ? <CheckCircle2 className={`w-3 h-3 ${styles.text} shrink-0`} /> : <FileText className={`w-3 h-3 ${styles.text} shrink-0`} />}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-xs text-white font-medium truncate tracking-tight">{doc.label}</span>
                            <span className="text-zinc-600 text-xs shrink-0">·</span>
                            <span className="text-xs text-zinc-400 truncate tracking-tight">{doc.tenant}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400 truncate tracking-tight">{doc.meta}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                        <div className={`px-2 py-0.5 rounded ring-1 ${styles.badge}`}>
                          <span className="font-mono tnum text-[10px] font-medium whitespace-nowrap">{doc.stage === 'Drafted' ? 'READY TO FILE' : doc.stage === 'Review' ? 'IN REVIEW' : doc.stage === 'Filed' ? 'FILED' : 'AWAITING SIGNATURE'}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium font-mono tnum whitespace-nowrap tracking-tight">{doc.stage === 'Filed' ? 'Accepted' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
          </div>
        </section>

        {/* ── Section 3: Active Cases Table (Vercel Style) ── */}
        <section className="relative flex-1 overflow-x-auto mt-4 rounded-xl">
          <AmbientGlow colorClass="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/50 via-blue-900/10 to-transparent" />
          <div className="min-w-[900px] bg-black/50 backdrop-blur-xl ring-1 ring-white/10 p-6 rounded-xl shadow-2xl h-full">
            <div className="pb-6">
              <h2 className="text-xl font-medium text-white font-sans">Active Cases</h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  {["Tenant", "Docket", "Presiding", "Arrears", "Action"].map((h) => (
                    <th key={h} className="text-xs font-medium text-zinc-500 px-2 py-3 whitespace-nowrap font-sans">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {(CASES || []).map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900 transition-colors group">
                    <td className="px-2 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-100 font-sans tracking-tight">{c.tenant}</span>
                        <span className="text-xs text-zinc-400 font-sans mt-0.5 tracking-tight">{c.phone}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-100 font-sans tracking-tight">{c.caseNumber}</span>
                        <button onClick={() => copyToClipboard(c.caseNumber)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-colors">
                          <ClipboardCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-100 font-sans tracking-tight">{c.judge}</span>
                        <span className="text-xs text-zinc-400 font-sans mt-0.5 tracking-tight">{c.courtroom}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span className="text-sm text-zinc-100 font-sans tracking-tight">{c.arrears}</span>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDrawer(c.caseNumber)}
                          className="px-3 py-1.5 text-xs font-medium text-black bg-white hover:bg-zinc-200 rounded-md transition-colors font-sans"
                        >
                          Quick File
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        </motion.div>
      </div>

      <DocumentDrawer
        isOpen={drawer.isOpen}
        onClose={() => setDrawer({ isOpen: false })}
        initialCase={
          drawer.caseRow
            ? {
                caseNumber: drawer.caseRow.caseNumber,
                tenantName: drawer.caseRow.tenant,
                landlordName: "Unknown Landlord",
                noticeType: "Notice",
                arrearsAmount: drawer.caseRow.arrears,
              }
            : undefined
        }
        initialTemplate={drawer.defaultTemplate}
      />
    </>
  );
}
