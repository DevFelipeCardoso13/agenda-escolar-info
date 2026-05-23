import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-jdm-azul focus:ring-2 focus:ring-jdm-gelo/70 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-jdm-medio",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
