import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: string;
  urgent?: boolean;
  icon?: ReactNode;
}

export function MetricCard({
  label,
  value,
  sublabel,
  trend,
  urgent = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "panel p-4 flex flex-col gap-3 relative overflow-hidden",
        urgent && "panel-critical"
      )}
    >
      {/* Urgency pip */}
      {urgent && (
        <span
          className="status-pip status-pip-rose pip-pulse absolute top-3.5 right-3.5"
          aria-label="Urgent"
        />
      )}

      {/* Micro-label */}
      <span className="micro-label">{label}</span>

      {/* Metric digit */}
      <span className={cn("metric-digit", urgent && "text-rose-400")}>
        {value}
      </span>

      {/* Sub-label / trend */}
      {(sublabel || trend) && (
        <div className="flex items-center gap-2 mt-auto">
          {sublabel && (
            <span className="text-[11px] text-zinc-500 font-normal">
              {sublabel}
            </span>
          )}
          {trend && (
            <span className="text-[11px] font-mono text-zinc-600">{trend}</span>
          )}
        </div>
      )}
    </div>
  );
}
