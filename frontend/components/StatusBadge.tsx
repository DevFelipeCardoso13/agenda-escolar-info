import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status?: string;
};

const statusMap: Record<string, { variant: string; label: string }> = {
  confirmado: { variant: "success", label: "Confirmado" },
  cancelado: { variant: "danger", label: "Cancelado" },
  concluido: { variant: "secondary", label: "Concluído" },
  manutencao: { variant: "warning", label: "Manutenção" },
  manutenção: { variant: "warning", label: "Manutenção" },
};

export default function StatusBadge({ status = "pendente" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const config = statusMap[normalized] ?? { variant: "default", label: status || "Pendente" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
