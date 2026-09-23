export function formatWhen(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  }).format(d);
}

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(new Date(iso));
}

export function hoursLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "due now";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h >= 48) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h >= 1) return `${h}h ${m}m`;
  return `${m}m`;
}

export const LANE_LABEL: Record<string, string> = {
  eviction: "Eviction defense",
  housing: "Housing stability",
  medical: "Medical casework",
  benefits: "Benefits & recert",
};
