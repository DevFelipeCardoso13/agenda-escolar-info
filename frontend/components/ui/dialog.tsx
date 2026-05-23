"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DialogProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
};

type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const Dialog = ({ open, children }: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      {children}
    </div>
  );
};

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-900", className)}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-xl font-semibold text-slate-900 dark:text-slate-100", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-slate-600 dark:text-slate-400", className)} {...props} />
  )
);
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
