"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({ open, title, description, onCancel, onConfirm }: ConfirmModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onCancel}>
              Voltar
            </Button>
            <Button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-500">
              Confirmar cancelamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
