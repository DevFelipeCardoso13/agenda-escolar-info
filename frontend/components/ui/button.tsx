import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline";
};

const variants: Record<string, string> = {
  default:
    "bg-jdm-azul text-white hover:bg-jdm-medio focus-visible:ring-jdm-amarelo dark:focus-visible:ring-jdm-gelo",
  secondary:
    "bg-jdm-medio text-white hover:bg-jdm-azul focus-visible:ring-jdm-amarelo dark:focus-visible:ring-jdm-gelo",
  outline:
    "border border-jdm-azul text-jdm-azul hover:bg-jdm-gelo focus-visible:ring-jdm-azul dark:hover:bg-slate-800 dark:border-slate-200 dark:text-slate-100",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-jdm-azul",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
