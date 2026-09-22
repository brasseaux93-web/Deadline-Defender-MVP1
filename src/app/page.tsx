"use client";

import { useState, useEffect } from "react";
import { DocumentDrawer } from "@/components/ui/DocumentGenerator";
import { SyncStatusModal } from "@/components/ui/SyncStatusModal";
import { Clock, TrendingDown, ClipboardCopy, FileText, CheckCircle2, Zap, Search, List, CalendarDays, Bell, Send, Mail, ChevronRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  const baseWrapper = "border-y border-r border-white/5 bg-zinc-950/60 backdrop-blur-md shadow-sm";
  switch (color) {
    case 'red': return { wrapper: `${baseWrapper} border-l-4 border-l-red-500`, badge: "bg-red-500/10 ring-red-500/20 text-red-400", title: "text-white", text: "text-red-400" };
    case 'orange': return { wrapper: `${baseWrapper} border-l-4 border-l-amber-500`, badge: "bg-amber-500/10 ring-amber-500/20 text-amber-400", title: "text-white", text: "text-amber-400" };
    case 'blue': return { wrapper: `${baseWrapper} border-l-4 border-l-sky-500`, badge: "bg-sky-500/10 ring-sky-500/20 text-sky-400", title: "text-white", text: "text-sky-400" };
    case 'emerald': return { wrapper: `${baseWrapper} border-l-4 border-l-emerald-500`, badge: "bg-emerald-500/10 ring-emerald-500/20 text-emerald-400", title: "text-white", text: "text-emerald-400" };
    default: return { wrapper: `${baseWrapper} border-l border-l-white/5`, badge: "bg-zinc-800 border border-zinc-700 text-zinc-300", title: "text-zinc-100", text: "text-zinc-400" };
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
  const [isSyncModalOpen, setSyncModalOpen] = useState(false);
  const [triageView, setTriageView] = useState<"list" | "timeline">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  // Fix hydration mismatch by only rendering client-side content after mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
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

  const filteredCases = CASES.filter(c => {
    const matchesSearch = c.tenant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.judge.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeFilter === "All") return true;
    if (activeFilter === "KC Superior") return c.courtroom.includes("Superior") || c.judge.includes("Smith"); // Using Smith as a mock Superior indicator
    if (activeFilter === "KC District") return c.courtroom.includes("Courtroom"); 
    if (activeFilter === "Arrears > $2k") {
      const amt = parseFloat(c.arrears.replace(/[^0-9.]/g, ''));
      return amt > 2000;
    }
    return true;
  });

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none z-0">
        <Image 
          src="/hero-seattle.png" 
          alt="Seattle Skyline" 
          fill 
          className="object-cover opacity-30 object-[center_30%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black" />
      </div>

      <div className="flex flex-col text-zinc-50 px-8 pb-12 gap-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 flex items-center justify-between shrink-0 py-8 -mx-8 px-8 bg-black/60 backdrop-blur-md border-b border-white/5">
          <h1 className="text-2xl font-semibold tracking-tight font-sans text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSyncModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 shadow-sm hover:bg-zinc-800 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-sans text-xs text-zinc-300 font-medium tracking-tight uppercase">King County Sync Active</span>
            </button>
            <Link href="/intake">
              <button className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 font-medium text-sm py-1.5 px-4 rounded-md transition-colors shadow-sm">
                <Zap className="w-4 h-4" />
                Quick Intake
              </button>
            </Link>
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
              <span className="text-sm font-medium text-zinc-300 font-sans">
                {m.label}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-semibold tracking-tight text-white font-sans">
                  {m.value}
                </span>
                {m.urgent && <TrendingDown className="w-4 h-4 text-zinc-400" />}
              </div>
              <span className="text-xs text-zinc-400 font-sans mt-1">{m.sub}</span>
            </div>
          ))}
        </section>

        {/* ── Section 2: Middle Split ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 shrink-0 mt-12">
          
          {/* Left: Deadline Triage */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6 h-6 px-1">
              <h2 className="text-sm font-semibold tracking-tight text-white truncate">Deadline Triage</h2>
              <div className="flex items-center gap-1 bg-zinc-900/50 p-0.5 rounded-md border border-white/5">
                <button onClick={() => setTriageView("list")} className={`p-1 rounded ${triageView === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <List className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setTriageView("timeline")} className={`p-1 rounded ${triageView === 'timeline' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <CalendarDays className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
              
            {triageView === "list" ? (
              <div className="space-y-4">
                {(DEADLINES || []).map((d) => {
                  const color = d.tier.includes('CRITICAL') ? 'red' : 'zinc';
                  const styles = getCardStyles(color);
                  return (
                  <div key={d.id} className={`relative ${styles.wrapper} rounded-xl overflow-hidden p-5 ${interactiveRow}`}>
                    {/* Card Content */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`w-7 h-7 rounded-full ${styles.badge} ring-1 flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className="text-[10px] font-bold">{d.advocate}</span>
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-lg font-semibold tracking-tight text-white truncate">{d.tenant}</span>
                            <span className="text-sm font-mono text-zinc-500 shrink-0">·</span>
                            <span className="font-mono tnum text-sm text-zinc-400 truncate tracking-tight">{d.docket}</span>
                          </div>
                          <span className="text-sm font-medium text-zinc-500 truncate tracking-tight">{d.grounds}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                        {d.tier.includes('CRITICAL') ? (
                          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md shadow-sm transition-colors border border-red-500/50">
                            <Bell className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[11px] font-semibold tracking-wider font-sans">ALERT COUNSEL</span>
                          </button>
                        ) : (
                          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded ring-1 ${styles.badge}`}>
                            <span className={`font-mono tnum text-xs font-semibold whitespace-nowrap ${styles.text}`}>{d.countdown}</span>
                          </div>
                        )}
                        <span className={`text-sm font-semibold font-mono tnum whitespace-nowrap tracking-tight ${styles.text}`}>{d.deadline} · {d.court}</span>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 h-full min-h-[250px]">
                <div className="flex border-b border-white/5 pb-2 mb-4 text-xs font-semibold text-zinc-400 font-mono">
                  <div className="flex-1">Today</div>
                  <div className="flex-1">Tomorrow</div>
                  <div className="flex-1">Thu</div>
                </div>
                <div className="space-y-4">
                  {DEADLINES.map((d, i) => (
                    <div key={d.id} className="relative w-full h-8 bg-zinc-900/50 rounded-md overflow-hidden">
                      <div 
                        className={`absolute top-0 bottom-0 ${d.tier.includes('CRITICAL') ? 'bg-red-500/20 border-l-2 border-red-500' : 'bg-zinc-700/40 border-l-2 border-zinc-500'} flex items-center px-2`}
                        style={{ 
                          left: i === 0 ? '0%' : i === 1 ? '15%' : '50%',
                          width: i === 0 ? '25%' : i === 1 ? '35%' : '40%'
                        }}
                      >
                        <span className="text-xs font-semibold text-white truncate">{d.tenant} · {d.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Document Coordination */}
          <div className="flex flex-col">
            <div className="px-1 mb-6 h-6 flex items-end">
              <h2 className="text-sm font-semibold tracking-tight text-white truncate">Document Coordination Pipeline</h2>
            </div>
              
            <div className="space-y-4">
                {(DOC_COORD || []).map((doc) => {
                  let color = 'zinc';
                  if (doc.stage === 'Filed') color = 'emerald';
                  else if (doc.stage === 'Drafted') color = 'blue';
                  else if (doc.stage === 'Signature' || doc.stage === 'Review') color = 'orange';
                  const styles = getCardStyles(color);

                  return (
                  <div key={doc.id} className={`relative ${styles.wrapper} rounded-xl overflow-hidden p-5 ${interactiveRow}`}>
                    {/* Card Content */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`w-7 h-7 rounded-full ${styles.badge} ring-1 flex items-center justify-center shrink-0 mt-0.5`}>
                          {doc.stage === 'Filed' ? <CheckCircle2 className={`w-3.5 h-3.5 ${styles.text} shrink-0`} /> : <FileText className={`w-3.5 h-3.5 ${styles.text} shrink-0`} />}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-lg font-semibold tracking-tight text-white truncate">{doc.tenant}</span>
                            <span className="text-sm font-mono text-zinc-500 shrink-0">·</span>
                            <span className="text-sm font-medium text-zinc-400 truncate tracking-tight">{doc.label}</span>
                          </div>
                          <span className="text-sm font-medium text-zinc-500 truncate tracking-tight">{doc.meta}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                        {doc.stage === 'Drafted' ? (
                          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-sm border border-sky-500/50 transition-colors">
                            <Send className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold tracking-wider font-sans">SUBMIT E-FILE</span>
                          </button>
                        ) : doc.stage === 'Signature' ? (
                          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md shadow-sm border border-amber-500/50 transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold tracking-wider font-sans">RESEND LINK</span>
                          </button>
                        ) : doc.stage === 'Review' ? (
                          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md shadow-sm border border-amber-500/50 transition-colors">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold tracking-wider font-sans">VIEW DRAFT</span>
                          </button>
                        ) : (
                          <div className={`px-2.5 py-0.5 rounded ring-1 ${styles.badge}`}>
                            <span className="font-mono tnum text-xs font-semibold whitespace-nowrap">FILED</span>
                          </div>
                        )}
                        <span className={`text-sm font-semibold font-mono tnum whitespace-nowrap tracking-tight ${styles.text}`}>{doc.stage === 'Filed' ? 'Accepted' : 'Pending Action'}</span>
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
          <div className="min-w-225 bg-black/50 backdrop-blur-xl ring-1 ring-white/10 p-6 rounded-xl shadow-2xl h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-medium text-white font-sans shrink-0">Active Cases</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search cases, tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-md py-1.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div className="hidden lg:flex items-center gap-2">
                  {["All", "KC Superior", "KC District", "Arrears > $2k"].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setActiveFilter(f)} 
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${activeFilter === f ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-2 py-3 w-8"></th>
                  {["Tenant", "Docket", "Arrears", "Action"].map((h) => (
                    <th key={h} className="text-xs font-medium text-zinc-300 px-2 py-3 whitespace-nowrap font-sans uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredCases.map((c) => {
                  const isExpanded = expandedRows.has(c.id);
                  return (
                  <React.Fragment key={c.id}>
                    <tr onClick={() => toggleRow(c.id)} className="hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                      <td className="px-2 py-4">
                        <div className="flex items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <span className="text-sm font-medium text-zinc-100 font-sans tracking-tight">{c.tenant}</span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-200 font-sans tracking-tight">{c.caseNumber}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(c.caseNumber); }} 
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            <ClipboardCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <span className="text-sm text-zinc-200 font-sans tracking-tight">{c.arrears}</span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openDrawer(c.caseNumber); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:text-white rounded-md transition-colors font-sans"
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-400" />
                            Quick File
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-zinc-900/20 border-t-0">
                        <td colSpan={5} className="px-4 py-4 border-l-2 border-l-blue-500/50">
                          <div className="flex items-center gap-12 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Phone</span>
                              <span className="text-zinc-300">{c.phone}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Presiding Judge</span>
                              <span className="text-zinc-300">{c.judge}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Courtroom</span>
                              <span className="text-zinc-300">{c.courtroom}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  );
                })}
                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-2 py-8 text-center text-zinc-500 text-sm">
                      No cases found matching your criteria.
                    </td>
                  </tr>
                )}
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

      <SyncStatusModal 
        isOpen={isSyncModalOpen} 
        onClose={() => setSyncModalOpen(false)} 
      />
    </>
  );
}
