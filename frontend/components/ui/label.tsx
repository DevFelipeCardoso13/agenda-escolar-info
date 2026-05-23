import * as React from "react";
import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    <label ref={ref} className={cn("block text-sm font-semibold text-slate-800 dark:text-slate-200", className)} {...props} />
  );
});

Label.displayName = "Label";

export { Label };
