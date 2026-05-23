import * as React from "react";
import { Controller, type Control, type FieldValues, type Path, type ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";

export function Form({ className, children, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  return (
    <form className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  );
}

export function FormField<TFormValues extends FieldValues>({
  control,
  name,
  render,
}: {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  render: (params: {
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
  }) => React.ReactNode;
}) {
  return <Controller control={control} name={name} render={render} />;
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-semibold text-slate-800", className)} {...props} />;
}

export function FormControl({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-1", className)} {...props} />;
}

export function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-rose-600", className)} {...props}>
      {children}
    </p>
  );
}
