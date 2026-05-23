"use client";

import { useCallback, useEffect, useState } from "react";
import { Toast } from "@/components/ui/toast";

type ToastVariant = "success" | "error" | "info";

type ToastOptions = {
  message: string;
  variant?: ToastVariant;
};

export function useToast() {
  const [toastOptions, setToastOptions] = useState<ToastOptions | null>(null);

  const toast = useCallback((options: ToastOptions) => {
    setToastOptions(options);
  }, []);

  useEffect(() => {
    if (!toastOptions) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastOptions(null);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toastOptions]);

  function ToastViewport() {
    if (!toastOptions) {
      return null;
    }

    return <Toast message={toastOptions.message} variant={toastOptions.variant} />;
  }

  return {
    toast,
    ToastViewport,
  };
}
