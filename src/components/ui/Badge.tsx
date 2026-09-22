import React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "success" | "warning" | "danger" | "neutral";
};

export function Badge({
  variant = "neutral",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span {...props} className={`badge badge--${variant} ${className}`}>
      {children}
    </span>
  );
}
