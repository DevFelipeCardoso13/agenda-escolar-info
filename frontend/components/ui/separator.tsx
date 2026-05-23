import * as React from "react";
import { cn } from "@/lib/utils";

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        orientation === "vertical" ? "mx-3 h-full w-px bg-slate-200" : "my-4 h-px w-full bg-slate-200",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator };
