"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  FileText,
  Copy,
  Check,
  Download,
  Loader2,
  ChevronDown,
} from "lucide-react";

const DOCUMENT_TEMPLATES = [
  "Answer & Affirmative Defenses (RCW 59.18)",
  "Motion to Stay Execution of Writ of Restitution",
  "Tenant Hardship Declaration & Payment Plan Proposal",
] as const;

type DocumentTemplate = (typeof DOCUMENT_TEMPLATES)[number];

interface DrawerCase {
  caseNumber: string;
  tenantName: string;
  landlordName?: string;
  noticeType?: string;
  arrearsAmount?: string;
}

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCase?: DrawerCase;
  initialTemplate?: DocumentTemplate;
}

export function DocumentDrawer({
  isOpen,
  onClose,
  initialCase,
  initialTemplate,
}: DocumentDrawerProps) {
  const [caseNumber, setCaseNumber] = useState(initialCase?.caseNumber ?? "");
  const [tenantName, setTenantName] = useState(initialCase?.tenantName ?? "");
  const [landlordName, setLandlordName] = useState(initialCase?.landlordName ?? "");
  const [noticeType, setNoticeType] = useState(initialCase?.noticeType ?? "3-Day Pay or Vacate");
  const [arrearsAmount, setArrearsAmount] = useState(initialCase?.arrearsAmount ?? "");
  const [courtJurisdiction, setCourtJurisdiction] = useState("King County District Court");
  const [documentType, setDocumentType] = useState<DocumentTemplate>(
    initialTemplate ?? DOCUMENT_TEMPLATES[0]
  );

  const [isStreaming, setIsStreaming] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync initialCase when drawer opens
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen && initialCase) {
        setCaseNumber(initialCase.caseNumber ?? "");
        setTenantName(initialCase.tenantName ?? "");
        setLandlordName(initialCase.landlordName ?? "");
        setNoticeType(initialCase.noticeType ?? "3-Day Pay or Vacate");
        setArrearsAmount(initialCase.arrearsAmount ?? "");
      }
      if (isOpen && initialTemplate) {
        setDocumentType(initialTemplate);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen, initialCase, initialTemplate]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        abortRef.current?.abort();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current && isStreaming) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, isStreaming]);

  const handleGenerate = useCallback(async () => {
    if (isStreaming) {
      abortRef.current?.abort();
      setIsStreaming(false);
      return;
    }

    setOutput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          caseNumber,
          tenantName,
          landlordName,
          noticeType,
          arrearsAmount,
          courtJurisdiction,
          documentType,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const { content } = JSON.parse(payload);
            if (content) setOutput((prev) => prev + content);
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setOutput((prev) => prev + "\n\n**[Error generating document. Check your API key and network.]**");
      }
    } finally {
      setIsStreaming(false);
    }
  }, [caseNumber, tenantName, landlordName, noticeType, arrearsAmount, courtJurisdiction, documentType, isStreaming]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    const pleadingHeader = `DEADLINE DEFENDER — GENERATED PLEADING DRAFT\nGenerated: ${new Date().toLocaleString()}\nDocument: ${documentType}\nCase: ${caseNumber} | Tenant: ${tenantName}\n${"—".repeat(60)}\n\n`;
    navigator.clipboard.writeText(pleadingHeader + output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output, documentType, caseNumber, tenantName]);

  const handleExportMarkdown = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentType.replace(/[^a-z0-9]/gi, "_")}_${caseNumber || "draft"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, documentType, caseNumber]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Document Generator"
        className="fixed top-0 right-0 bottom-0 z-50 flex"
        style={{ width: "min(720px, 90vw)" }}
      >
        <div className="flex-1 bg-black border-l border-[#27272a] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a] shrink-0">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium text-zinc-100">Document Generator</span>
              <span className="micro-label ml-1 text-zinc-600">GROQ / llama-3.3-70b</span>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Split body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left pane — form inputs */}
            <div className="w-64 shrink-0 border-r border-[#27272a] flex flex-col overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Template selector */}
                <div className="space-y-1.5">
                  <label className="micro-label block">Template</label>
                  <div className="relative">
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value as DocumentTemplate)}
                      className="field-input appearance-none pr-7"
                    >
                      {DOCUMENT_TEMPLATES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="border-t border-[#27272a] pt-4 space-y-3">
                  <span className="micro-label block text-zinc-600">Case Details</span>

                  <Field label="Case Number" value={caseNumber} onChange={setCaseNumber} placeholder="24-2-12345-6" mono />
                  <Field label="Tenant Name" value={tenantName} onChange={setTenantName} placeholder="Full legal name" />
                  <Field label="Landlord Name" value={landlordName} onChange={setLandlordName} placeholder="Plaintiff name" />

                  <div className="space-y-1.5">
                    <label className="micro-label block">Notice Type</label>
                    <div className="relative">
                      <select
                        value={noticeType}
                        onChange={(e) => setNoticeType(e.target.value)}
                        className="field-input appearance-none pr-7"
                      >
                        <option>3-Day Pay or Vacate</option>
                        <option>10-Day Notice to Comply</option>
                        <option>20-Day Notice to Vacate</option>
                        <option>14-Day Notice (ERPP)</option>
                        <option>Unlawful Detainer Complaint</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>

                  <Field label="Arrears Amount" value={arrearsAmount} onChange={setArrearsAmount} placeholder="$0.00" mono />

                  <div className="space-y-1.5">
                    <label className="micro-label block">Court Jurisdiction</label>
                    <div className="relative">
                      <select
                        value={courtJurisdiction}
                        onChange={(e) => setCourtJurisdiction(e.target.value)}
                        className="field-input appearance-none pr-7"
                      >
                        <option>King County District Court</option>
                        <option>King County Superior Court</option>
                        <option>Seattle Municipal Court</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  className={[
                    "w-full py-2 px-3 rounded-md text-xs font-medium transition-colors duration-150 flex items-center justify-center gap-2",
                    isStreaming
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "bg-white text-black hover:bg-zinc-200",
                  ].join(" ")}
                >
                  {isStreaming ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Stop
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right pane — streaming output */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Output toolbar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#27272a] shrink-0">
                <span className="micro-label text-zinc-600 mr-auto">
                  {isStreaming ? "Generating…" : output ? "Draft Ready" : "Awaiting Input"}
                </span>
                {output && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#27272a] bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? "Copied" : "Copy as Pleading"}
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#27272a] bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Export .md
                    </button>
                  </>
                )}
              </div>

              {/* Output area */}
              <div
                ref={outputRef}
                className="flex-1 overflow-y-auto p-4"
              >
                {!output && !isStreaming && (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#27272a] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-zinc-600" />
                    </div>
                    <p className="text-xs text-zinc-600 max-w-48">
                      Fill in the case details and click Generate to draft a document.
                    </p>
                  </div>
                )}

                {(output || isStreaming) && (
                  <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {output}
                    {isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-zinc-400 ml-0.5 align-middle animate-pulse" />
                    )}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="micro-label block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={["field-input", mono ? "font-mono" : ""].join(" ")}
      />
    </div>
  );
}
