export type PracticeLane =
  | "housing"
  | "eviction"
  | "medical"
  | "benefits";

export type Urgency = "critical" | "soon" | "watch" | "stable";

export type MatterStatus =
  | "intake"
  | "active"
  | "hearing"
  | "stayed"
  | "resolved"
  | "closed";

export type InstrumentStatus =
  | "sealed"
  | "draft"
  | "review"
  | "signature"
  | "ready"
  | "filed"
  | "served";

export type InstrumentKind =
  | "notice-of-appearance"
  | "answer-affirmative-defenses"
  | "motion-stay-writ"
  | "hardship-declaration"
  | "motion-vacate-default"
  | "certificate-of-service"
  | "payment-plan-order"
  | "care-coordination"
  | "roi-medical";

export interface HouseholdMember {
  name: string;
  relation: string;
  age?: number;
}

export interface DeadlineEvent {
  id: string;
  clientId: string;
  label: string;
  at: string;
  kind: "filing" | "hearing" | "notice" | "medical" | "housing" | "followup";
  urgency: Urgency;
  channel: "court" | "client" | "counsel" | "agency";
  done?: boolean;
}

export interface VaultFolio {
  id: string;
  clientId: string;
  kind: InstrumentKind;
  title: string;
  status: InstrumentStatus;
  pages: number;
  updatedAt: string;
  sealed: boolean;
  authority: string;
}

export interface ClientMatter {
  id: string;
  legalName: string;
  preferredName: string;
  initials: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  practice: PracticeLane;
  status: MatterStatus;
  urgency: Urgency;
  docket?: string;
  court?: string;
  courtroom?: string;
  judge?: string;
  landlord?: string;
  opposingCounsel?: string;
  noticeType?: string;
  noticeServedOn?: string;
  arrears?: string;
  monthlyRent?: string;
  hearingAt?: string;
  advocate: string;
  advocateInitials: string;
  languages: string[];
  household: HouseholdMember[];
  story: string;
  secondChance: string;
  medicalNotes?: string;
  agency?: string;
  folios: VaultFolio[];
  dates: DeadlineEvent[];
}
