import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "danger" | "warning" | "secondary";
};

const variants: Record<string, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-jdm-verde text-white",
  danger: "bg-rose-600 text-white",
  warning: "bg-jdm-amarelo text-jdm-azul",
  secondary: "bg-slate-500 text-white",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };
