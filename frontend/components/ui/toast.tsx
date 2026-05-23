import * as React from "react";
import { cn } from "@/lib/utils";

type ToastProps = {
  message: string;
  variant?: "success" | "error" | "info";
};

export function Toast({ message, variant = "info" }: ToastProps) {
  const variants: Record<string, string> = {
    success: "bg-jdm-verde text-white",
    error: "bg-rose-600 text-white",
    info: "bg-jdm-medio text-white",
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 rounded-3xl px-5 py-4 shadow-soft", variants[variant])}>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
