import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PanelVariant = "default" | "critical" | "warning";

interface LiquidGlassSurfaceProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: PanelVariant;
}

const variantClasses: Record<PanelVariant, string> = {
  default: "",
  critical: "panel-critical",
  warning: "panel-warning",
};

export function LiquidGlassSurface({
  children,
  className,
  interactive = false,
  variant = "default",
}: LiquidGlassSurfaceProps) {
  return (
    <div
      className={cn(
        "panel",
        variantClasses[variant],
        interactive && "panel-hover panel-interactive",
        className
      )}
    >
      {children}
    </div>
  );
}
