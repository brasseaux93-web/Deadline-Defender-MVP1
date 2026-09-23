import type { ClientMatter, DeadlineEvent, InstrumentKind } from "./types";

export const ADVOCATE = {
  name: "Renee Chen",
  initials: "RC",
  org: "Deadline Defender · King County Continuance Desk",
  bar: "[BAR NO.]",
  phone: "(206) 555-0140",
  email: "rchen@deadlinedefender.org",
};

export const CLIENTS: ClientMatter[] = [
  {
    id: "maria-gonzalez",
    legalName: "Maria Elena Gonzalez",
    preferredName: "Maria Gonzalez",
    initials: "MG",
    phone: "(206) 555-0192",
    email: "m.gonzalez@example.net",
    address: "2847 Rainier Ave S, Apt 4B",
    city: "Seattle",
    zip: "98144",
    practice: "eviction",
    status: "hearing",
    urgency: "critical",
    docket: "24-2-09841-7",
    court: "King County District Court",
    courtroom: "W-728",
    judge: "Hon. Roberts",
    landlord: "Lakeview Properties LLC",
    opposingCounsel: "Hart & Vale LLP",
    noticeType: "14-Day Notice to Pay or Vacate (RCW 59.18.057 / .365)",
    noticeServedOn: "2026-09-08",
    arrears: "$2,450.00",
    monthlyRent: "$1,225.00",
    hearingAt: "2026-09-24T09:00:00-07:00",
    advocate: "Renee Chen",
    advocateInitials: "RC",
    languages: ["English", "Spanish"],
    household: [
      { name: "Maria Elena Gonzalez", relation: "Tenant", age: 41 },
      { name: "Sofia Gonzalez", relation: "Daughter", age: 9 },
    ],
    story: "Fourteen-year tenant. Hours cut at Harborview dietary. 14-day notice lists a 3-day cure window and omits Eviction Defense Screening Line language.",
    secondChance: "Six-month catch-up at $408.33 plus current rent, sourced from emergency rental assistance already approved pending court stay.",
    folios: [
      folio("mg-noa", "maria-gonzalez", "notice-of-appearance", "Notice of Appearance", "filed", 1, "RCW 59.18.365"),
      folio("mg-ans", "maria-gonzalez", "answer-affirmative-defenses", "Answer & Affirmative Defenses", "review", 6, "RCW 59.18 · 59.12"),
      folio("mg-stay", "maria-gonzalez", "motion-stay-writ", "Motion to Stay Writ of Restitution", "draft", 4, "RCW 59.18.410"),
      folio("mg-dec", "maria-gonzalez", "hardship-declaration", "Tenant Declaration & Payment Plan", "signature", 3, "RCW 59.18.410(3)"),
    ],
    dates: [
      ev("mg-d1", "maria-gonzalez", "File written Answer", "2026-09-23T17:00:00-07:00", "filing", "critical", "court"),
      ev("mg-d2", "maria-gonzalez", "Show-cause hearing", "2026-09-24T09:00:00-07:00", "hearing", "critical", "court"),
      ev("mg-d3", "maria-gonzalez", "Notify Maria — hearing reminder", "2026-09-23T18:00:00-07:00", "followup", "soon", "client"),
    ],
  },
  {
    id: "james-okafor",
    legalName: "James Chukwuemeka Okafor",
    preferredName: "James Okafor",
    initials: "JO",
    phone: "(253) 555-0104",
    email: "j.okafor@example.net",
    address: "910 S 320th St, Unit 12",
    city: "Federal Way",
    zip: "98003",
    practice: "eviction",
    status: "active",
    urgency: "critical",
    docket: "24-2-10023-1",
    court: "King County Superior Court",
    courtroom: "E-302",
    judge: "Hon. Smith",
    landlord: "Cascade Ridge Holdings",
    opposingCounsel: "Pinnacle Counsel PS",
    noticeType: "Unlawful Detainer Complaint after alleged 14-day notice",
    noticeServedOn: "2026-09-11",
    arrears: "$3,800.00",
    monthlyRent: "$1,900.00",
    hearingAt: "2026-09-25T13:30:00-07:00",
    advocate: "Amina Patel",
    advocateInitials: "AP",
    languages: ["English"],
    household: [
      { name: "James Chukwuemeka Okafor", relation: "Tenant", age: 38 },
      { name: "Grace Okafor", relation: "Spouse", age: 36 },
      { name: "Daniel Okafor", relation: "Son", age: 4 },
    ],
    story: "Default judgment entered after hospital admission. Writ posted. Household includes a four-year-old with scheduled oncology follow-up at Seattle Children's.",
    secondChance: "Vacate default for excusable neglect, stay writ under RCW 59.18.410(3), and stabilize with three months of prospective rent via source-of-income assistance.",
    medicalNotes: "Caregiver for pediatric oncology follow-up. Displacement would interrupt treatment transport.",
    folios: [
      folio("jo-vac", "james-okafor", "motion-vacate-default", "Motion to Vacate Default & Stay Writ", "draft", 7, "CR 60 · RCW 59.18.410"),
      folio("jo-dec", "james-okafor", "hardship-declaration", "Declaration of James Okafor", "signature", 4, "GR 13"),
      folio("jo-cos", "james-okafor", "certificate-of-service", "Certificate of Service", "ready", 1, "CR 5"),
    ],
    dates: [
      ev("jo-d1", "james-okafor", "Move to vacate + stay writ", "2026-09-23T16:30:00-07:00", "filing", "critical", "court"),
      ev("jo-d2", "james-okafor", "Superior Court hearing", "2026-09-25T13:30:00-07:00", "hearing", "soon", "court"),
      ev("jo-d3", "james-okafor", "Children's Hospital transport", "2026-09-26T08:00:00-07:00", "medical", "watch", "agency"),
    ],
  },
  {
    id: "linh-tran",
    legalName: "Linh Thi Tran",
    preferredName: "Linh Tran",
    initials: "LT",
    phone: "(425) 555-0177",
    email: "l.tran@example.net",
    address: "11808 NE 8th St",
    city: "Bellevue",
    zip: "98005",
    practice: "housing",
    status: "stayed",
    urgency: "soon",
    docket: "24-2-08812-4",
    court: "King County District Court",
    courtroom: "W-944",
    judge: "Hon. Davis",
    landlord: "Eastgate Residences",
    noticeType: "14-Day Pay or Vacate — payment plan proposed",
    arrears: "$1,200.00",
    monthlyRent: "$1,650.00",
    hearingAt: "2026-09-29T10:00:00-07:00",
    advocate: "Marcus Williams",
    advocateInitials: "MW",
    languages: ["English", "Vietnamese"],
    household: [{ name: "Linh Thi Tran", relation: "Tenant", age: 29 }],
    story: "Answer already filed. Court invited a payment plan under RCW 59.18.410. Tenant has first installment in hand.",
    secondChance: "Four-month plan: $300 arrears + current rent on the 1st. First installment ready to tender in open court.",
    folios: [
      folio("lt-ans", "linh-tran", "answer-affirmative-defenses", "Answer (filed)", "filed", 5, "RCW 59.18"),
      folio("lt-plan", "linh-tran", "payment-plan-order", "Proposed Payment Plan Order", "ready", 2, "RCW 59.18.410(3)"),
    ],
    dates: [
      ev("lt-d1", "linh-tran", "Tender first installment", "2026-09-29T10:00:00-07:00", "hearing", "soon", "court"),
      ev("lt-d2", "linh-tran", "Confirm ERAP disbursement", "2026-09-25T12:00:00-07:00", "housing", "watch", "agency"),
    ],
  },
  {
    id: "andre-ellis",
    legalName: "Andre Malik Ellis",
    preferredName: "Andre Ellis",
    initials: "AE",
    phone: "(206) 555-0166",
    email: "a.ellis@example.net",
    address: "4412 S Morgan St",
    city: "Seattle",
    zip: "98118",
    practice: "medical",
    status: "active",
    urgency: "soon",
    advocate: "Priya Nair",
    advocateInitials: "PN",
    languages: ["English"],
    agency: "Harborview Medical Respite",
    household: [{ name: "Andre Malik Ellis", relation: "Client", age: 54 }],
    story: "Post-discharge housing hold. Case manager coordinating respite bed and a landlord reasonable-accommodation letter so a medical appointment does not become an eviction.",
    secondChance: "Keep the unit with a documented accommodation for dialysis Tuesdays/Thursdays and a portable oxygen delivery window.",
    medicalNotes: "ESRD · dialysis Tue/Thu 06:30 · DME: portable O2.",
    folios: [
      folio("ae-roi", "andre-ellis", "roi-medical", "HIPAA / ROI — Harborview", "signature", 2, "45 C.F.R. § 164.508"),
      folio("ae-cc", "andre-ellis", "care-coordination", "Care Coordination Brief", "draft", 2, "Case note"),
    ],
    dates: [
      ev("ae-d1", "andre-ellis", "Dialysis — do not schedule court", "2026-09-24T06:30:00-07:00", "medical", "soon", "agency"),
      ev("ae-d2", "andre-ellis", "Landlord accommodation letter", "2026-09-26T15:00:00-07:00", "housing", "soon", "counsel"),
    ],
  },
  {
    id: "keisha-moore",
    legalName: "Keisha Moore",
    preferredName: "Keisha Moore",
    initials: "KM",
    phone: "(253) 555-0188",
    email: "k.moore@example.net",
    address: "624 S C St",
    city: "Tacoma",
    zip: "98405",
    practice: "benefits",
    status: "intake",
    urgency: "watch",
    advocate: "Marcus Williams",
    advocateInitials: "MW",
    languages: ["English"],
    household: [
      { name: "Keisha Moore", relation: "Client", age: 33 },
      { name: "Noah Moore", relation: "Son", age: 7 },
    ],
    story: "SNAP recertification and a housing authority recert packet due the same week. No UD filed. Preventive work so dates do not compound into a notice.",
    secondChance: "Complete recertification before the 30th and lock the subsidy so rent does not spike.",
    folios: [],
    dates: [
      ev("km-d1", "keisha-moore", "SNAP recert packet", "2026-09-30T17:00:00-07:00", "followup", "watch", "agency"),
      ev("km-d2", "keisha-moore", "SHA recert interview", "2026-10-02T11:00:00-07:00", "housing", "watch", "agency"),
    ],
  },
];

function folio(id: string, clientId: string, kind: InstrumentKind, title: string, status: ClientMatter["folios"][number]["status"], pages: number, authority: string) {
  return { id, clientId, kind, title, status, pages, updatedAt: "2026-09-22T16:40:00-07:00", sealed: status === "filed" || status === "sealed", authority };
}

function ev(id: string, clientId: string, label: string, at: string, kind: DeadlineEvent["kind"], urgency: DeadlineEvent["urgency"], channel: DeadlineEvent["channel"]): DeadlineEvent {
  return { id, clientId, label, at, kind, urgency, channel };
}

export function getClient(id: string) {
  return CLIENTS.find((c) => c.id === id);
}

export function allDates() {
  return CLIENTS.flatMap((c) => c.dates).sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export function allFolios() {
  return CLIENTS.flatMap((c) => c.folios);
}

export const RESOURCES = [
  {
    group: "Washington authority",
    items: [
      { label: "RCW 59.18 — RLTA", href: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18" },
      { label: "RCW 59.12 — Unlawful detainer", href: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.12" },
      { label: "RCW 59.18.410 — Stay of writ", href: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.410" },
      { label: "RCW 59.18.640 — Appointed counsel", href: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.640" },
      { label: "RCW 59.18.650 — Just cause", href: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.650" },
    ],
  },
  {
    group: "File & serve",
    items: [
      { label: "King County eFiling", href: "https://kingcounty.gov/en/dept/dja" },
      { label: "KC Sheriff — writs", href: "https://kingcounty.gov/en/dept/sheriff/courts-jails-legal-system/sheriff-services/evictions" },
      { label: "WA Law Help — vacate default", href: "https://www.washingtonlawhelp.org/vacate-default-eviction-judgment-and-stop-writ-restitution" },
    ],
  },
  {
    group: "Second-chance lines",
    items: [
      { label: "Eviction Defense Screening · 855-657-8387", href: "https://nwjustice.org/apply-online" },
      { label: "NJP apply online", href: "https://nwjustice.org/apply-online" },
      { label: "2-1-1 Washington", href: "https://wa211.org" },
    ],
  },
];
