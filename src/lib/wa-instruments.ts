import { ADVOCATE } from "./caseload";
import type { ClientMatter, InstrumentKind } from "./types";

export interface InstrumentMeta {
  kind: InstrumentKind;
  title: string;
  authority: string;
  purpose: string;
  submitTo: string;
  lanes: Array<ClientMatter["practice"] | "all">;
}

export const INSTRUMENT_CATALOG: InstrumentMeta[] = [
  { kind: "notice-of-appearance", title: "Notice of Appearance", authority: "RCW 59.18.365 · CR 4 / CR 5", purpose: "Places the tenant on the docket and preserves appointed-counsel and hearing rights.", submitTo: "Court clerk + opposing counsel + landlord", lanes: ["eviction", "housing"] },
  { kind: "answer-affirmative-defenses", title: "Answer & Affirmative Defenses", authority: "RCW 59.18 · RCW 59.12.030 · RCW 59.18.650", purpose: "Written response before 5:00 p.m. on the summons deadline. Phone calls are not an answer.", submitTo: "Court clerk (eFile) with certificate of service", lanes: ["eviction"] },
  { kind: "motion-stay-writ", title: "Motion to Stay Execution of Writ of Restitution", authority: "RCW 59.18.410(3)–(4)", purpose: "Pauses sheriff enforcement so the household can tender rent or complete a payment plan.", submitTo: "Court + email stay order to King County Sheriff Civil Unit", lanes: ["eviction"] },
  { kind: "hardship-declaration", title: "Tenant Declaration & Payment Plan Proposal", authority: "RCW 59.18.410(3) · GR 13", purpose: "Sworn facts for good cause: exigent circumstances, household harm, and a fair plan.", submitTo: "Attach to motion; serve opposing party", lanes: ["eviction", "housing"] },
  { kind: "motion-vacate-default", title: "Motion to Vacate Default Judgment & Stay Writ", authority: "CR 60 · RCW 59.18.410", purpose: "Reopens a default so the tenant can be heard, and stays the writ while the court decides.", submitTo: "Superior/District clerk + sheriff if writ already issued", lanes: ["eviction"] },
  { kind: "certificate-of-service", title: "Certificate of Service", authority: "CR 5 · RCW 59.12.040", purpose: "Proves the instrument reached the people who must receive it.", submitTo: "File with the instrument it accompanies", lanes: ["eviction", "housing"] },
  { kind: "payment-plan-order", title: "Proposed Order — Payment Plan & Stay", authority: "RCW 59.18.410(3)", purpose: "Gives the judge a ready order that restores the tenancy on stated terms.", submitTo: "Present in open court or ex parte as authorized", lanes: ["eviction", "housing"] },
  { kind: "care-coordination", title: "Care Coordination Brief", authority: "Case-management record", purpose: "Aligns medical appointments, housing holds, and court dates so they do not collide.", submitTo: "Internal vault + treating team with ROI", lanes: ["medical", "housing"] },
  { kind: "roi-medical", title: "Authorization to Release Health Information", authority: "45 C.F.R. § 164.508", purpose: "Lets the case manager share only what a court or landlord must see.", submitTo: "Provider HIM + sealed vault copy", lanes: ["medical"] },
];

export interface FilledInstrument {
  kind: InstrumentKind;
  title: string;
  authority: string;
  submitTo: string;
  markdown: string;
  names: string[];
}

export function fillInstrument(kind: InstrumentKind, c: ClientMatter): FilledInstrument {
  const meta = INSTRUMENT_CATALOG.find((m) => m.kind === kind)!;
  const names = unique([c.legalName, c.preferredName, c.landlord, ...c.household.map((h) => h.name), ADVOCATE.name]);
  return { kind, title: meta.title, authority: meta.authority, submitTo: meta.submitTo, names, markdown: render(kind, c) };
}

function unique(list: Array<string | undefined>) {
  return Array.from(new Set(list.filter((n): n is string => Boolean(n && n.trim()))));
}

function cap(c: ClientMatter) {
  const court = (c.court ?? "King County District Court").toUpperCase();
  const venue = court.includes("SUPERIOR")
    ? "IN THE SUPERIOR COURT OF THE STATE OF WASHINGTON IN AND FOR KING COUNTY"
    : "IN THE DISTRICT COURT OF THE STATE OF WASHINGTON IN AND FOR KING COUNTY";
  return `${venue}\n\n${n(c.landlord ?? "[PLAINTIFF / LANDLORD]")}\n\n                    Plaintiff,\n\n              v.                              No. ${c.docket ?? "[CASE NUMBER]"}\n\n${n(c.legalName)}\n\n                    Defendant / Tenant.\n`;
}

function n(name: string) {
  return `⟦${name}⟧`;
}

function sigBlock(c: ClientMatter) {
  return `Respectfully submitted this ____ day of ______________, 2026.\n\n\n_________________________________\n${n(ADVOCATE.name)}\n${ADVOCATE.org}\nWSBA ${ADVOCATE.bar}\n${ADVOCATE.phone} · ${ADVOCATE.email}\nAdvocate for ${n(c.legalName)}\n`;
}

function perjury(c: ClientMatter) {
  return `I declare under penalty of perjury under the laws of the State of Washington that the foregoing is true and correct.\n\nExecuted at ${c.city}, Washington, on ______________, 2026.\n\n\n_________________________________\n${n(c.legalName)}\n`;
}

function render(kind: InstrumentKind, c: ClientMatter) {
  switch (kind) {
    case "notice-of-appearance":
      return `${cap(c)}\nNOTICE OF APPEARANCE\n\nTO: The Clerk of the Court; ${n(c.landlord ?? "Plaintiff")}; and ${c.opposingCounsel ?? "counsel of record"}:\n\nPLEASE TAKE NOTICE that ${n(c.legalName)} appears in this action and requests that all further pleadings, notices, and papers be served upon the undersigned advocate at the address below.\n\n${n(c.legalName)} asserts the right to appointed counsel for an indigent tenant in an unlawful detainer proceeding under RCW 59.18.640, and asks that no default be entered without notice to counsel.\n\nThis Notice of Appearance is a written response. A telephone call to the landlord is not a response.\n\n${sigBlock(c)}`;
    case "answer-affirmative-defenses":
      return `${cap(c)}\nDEFENDANT'S ANSWER AND AFFIRMATIVE DEFENSES\n\nI. INTRODUCTION\n\n1. ${n(c.legalName)} ("Tenant") occupies the premises at ${c.address}, ${c.city}, WA ${c.zip} as a residential tenant. Household members: ${c.household.map((h) => n(h.name) + ` (${h.relation})`).join("; ")}.\n\n2. Plaintiff ${n(c.landlord ?? "[Landlord]")} commenced this unlawful detainer proceeding after service of a notice described as: ${c.noticeType ?? "[notice type]"}${c.noticeServedOn ? `, on ${c.noticeServedOn}` : ""}.\n\n3. Alleged arrears: ${c.arrears ?? "[amount]"}. Contract rent: ${c.monthlyRent ?? "[rent]"}.\n\nII. RESPONSE TO COMPLAINT\n\n4. Tenant admits occupying the premises and denies that Plaintiff is entitled to restitution, forfeiture, or a writ of restitution.\n\n5. Tenant denies each allegation not expressly admitted.\n\nIII. AFFIRMATIVE DEFENSES\n\n6. Defective notice — RCW 59.12.030; RCW 59.18.057; RCW 59.18.365. Any pay-or-vacate notice that uses a three-day residential rent window, omits the Eviction Defense Screening Line (855-657-8387), or fails to identify facts with the specificity RCW 59.18.650(6) requires is void.\n\n7. Just cause — RCW 59.18.650.\n\n8. Habitability — RCW 59.18.060. Tenant preserves set-off arising from conditions Plaintiff had a duty to remedy. Facts: [INSERT CONDITIONS].\n\n9. Equitable relief and payment — RCW 59.18.410. Tenant is prepared to tender current rent and a structured plan for any lawful arrears.\n\n10. Right to counsel — RCW 59.18.640.\n\n11. Retaliation reserved — RCW 59.18.240.\n\nIV. REQUEST FOR RELIEF\n\nTenant asks the Court to deny a writ, grant a stay under RCW 59.18.410, enter a payment plan that restores the tenancy, and award authorized costs.\n\n${sigBlock(c)}`;
    case "motion-stay-writ":
      return `${cap(c)}\nMOTION TO STAY EXECUTION OF WRIT OF RESTITUTION\n(RCW 59.18.410(3)–(4))\n\nI. RELIEF REQUESTED\n\n${n(c.legalName)} moves the Court to stay execution of any writ of restitution so the household may remain housed while lawful rent is tendered.\n\nII. FACTS\n\n1. Tenant resides at ${c.address}, ${c.city}, WA ${c.zip} with: ${c.household.map((h) => n(h.name)).join(", ")}.\n2. Notice: ${c.noticeType ?? "a notice relating to rent"}. Alleged arrears: ${c.arrears ?? "[amount]"}.\n3. Harm: ${c.story}\n4. Plan: ${c.secondChance}\n\nIII. AUTHORITY\n\n5. RCW 59.18.410(3) authorizes a stay on good cause and fair terms.\n6. RCW 59.18.410(4) authorizes an ex parte stay with a declaration of notice efforts and irreparable harm.\n7. Transmit any stay order to the King County Sheriff Civil Unit before lockout is calendared.\n\n${sigBlock(c)}`;
    case "hardship-declaration":
      return `${cap(c)}\nDECLARATION OF ${n(c.legalName)}\nIN SUPPORT OF STAY AND PAYMENT PLAN\n\nI, ${n(c.legalName)}, declare:\n\n1. I am the tenant at ${c.address}, ${c.city}, WA ${c.zip}.\n2. Household: ${c.household.map((h) => `${n(h.name)}, ${h.relation}${h.age ? `, age ${h.age}` : ""}`).join("; ")}.\n3. Notice: ${c.noticeType ?? "[notice]"}. Amount claimed: ${c.arrears ?? "[amount]"}. Rent: ${c.monthlyRent ?? "[rent]"}.\n4. Why I fell behind: ${c.story}\n5. What I ask the Court to protect: ${c.secondChance}\n6. I can pay current rent as it comes due and ask the Court to accept a written arrears schedule.\n7. I am working with ${n(c.advocate)} at Deadline Defender.\n${c.medicalNotes ? `8. Medical constraint: ${c.medicalNotes}\n` : ""}\n${perjury(c)}`;
    case "motion-vacate-default":
      return `${cap(c)}\nMOTION TO VACATE DEFAULT JUDGMENT AND TO STAY WRIT OF RESTITUTION\n(CR 60 · RCW 59.18.410)\n\n${n(c.legalName)} moves to vacate any default, stay any writ, and set the matter for hearing.\n\n1. Tenant did not willfully ignore the summons. ${c.story}\n2. Meritorious defenses include defective notice, just cause, and RCW 59.18.410.\n3. Household to be heard: ${c.household.map((h) => n(h.name)).join(", ")}.\n4. Request an ex parte stay under RCW 59.18.410(4) and transmission to the Sheriff Civil Unit.\n\n${sigBlock(c)}`;
    case "certificate-of-service":
      return `${cap(c)}\nCERTIFICATE OF SERVICE\n\nI certify under penalty of perjury under the laws of the State of Washington that on ______________, 2026, I served [TITLE OF INSTRUMENT] on:\n\n    ${n(c.landlord ?? "[Plaintiff]")}\n    c/o ${c.opposingCounsel ?? "[counsel or registered agent]"}\n    ☐ E-service  ☐ Email (agreed)  ☐ First-class mail  ☐ Messenger  ☐ Personal service\n\nExecuted at Seattle, Washington.\n\n_________________________________\n${n(ADVOCATE.name)}\n`;
    case "payment-plan-order":
      return `${cap(c)}\n[PROPOSED] ORDER GRANTING STAY AND APPROVING PAYMENT PLAN\n\nIT IS ORDERED:\n\n1. Execution of any writ of restitution is STAYED.\n2. ${n(c.legalName)} shall pay current rent of ${c.monthlyRent ?? "[rent]"} as it comes due.\n3. Any lawful arrears of ${c.arrears ?? "[amount]"} shall be paid on the schedule presented to the Court.\n4. Upon timely performance, the tenancy at ${c.address}, ${c.city}, WA ${c.zip} is restored.\n5. The King County Sheriff shall not execute a writ while this stay is in force.\n\nPresented by: ${n(ADVOCATE.name)}, WSBA ${ADVOCATE.bar}\nAdvocate for ${n(c.legalName)}\n`;
    case "care-coordination":
      return `DEADLINE DEFENDER — CARE COORDINATION BRIEF\nSealed vault copy · not for public docket unless a court so orders\n\nClient: ${n(c.legalName)} (${n(c.preferredName)})\nCase manager: ${n(c.advocate)}\nAgency: ${c.agency ?? "Deadline Defender medical lane"}\n\nClinical constraints: ${c.medicalNotes ?? "[no clinical detail on file]"}\nSecond-chance objective: ${c.secondChance}\n`;
    case "roi-medical":
      return `AUTHORIZATION TO RELEASE HEALTH INFORMATION\n\nI, ${n(c.legalName)}, authorize ${c.agency ?? "[PROVIDER]"} to disclose the minimum necessary health information to Deadline Defender and to ${n(c.advocate)} for housing stability, court scheduling, and reasonable-accommodation requests.\n\nThis authorization expires 180 days from the date signed, or when my housing matter closes, whichever is first.\n\n${perjury(c)}`;
  }
}

export function highlightNames(markdown: string, names: string[]) {
  let html = markdown.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
  html = html.replace(/⟦(.+?)⟧/g, '<mark class="name-mark">$1</mark>');
  const sorted = [...names].sort((a, b) => b.length - a.length);
  for (const name of sorted) {
    const re = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    html = html.replace(re, (match, offset, full) => {
      const before = full.slice(Math.max(0, offset - 24), offset);
      if (before.includes("name-mark")) return match;
      return `<mark class="name-mark">${match}</mark>`;
    });
  }
  return html.replace(/\n/g, "<br/>");
}
