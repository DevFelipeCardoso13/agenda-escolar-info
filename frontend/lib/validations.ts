import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export const newBookingSchema = z.object({
  equipamentoId: z.string().min(1, { message: "Selecione um equipamento" }),
  quantidade: z
    .number({ invalid_type_error: "Quantidade inválida" })
    .min(1, { message: "A quantidade deve ser pelo menos 1" }),
  dataInicio: z.string().min(1, { message: "Informe a data e hora de início" }),
  dataFim: z.string().min(1, { message: "Informe a data e hora de término" }),
  observacao: z.string().optional(),
}).refine((data) => new Date(data.dataInicio) < new Date(data.dataFim), {
  message: "A data de início deve ser anterior à data de término",
  path: ["dataFim"],
});

export const userSchema = z.object({
  name: z.string().min(2, { message: "Nome obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.enum(["admin", "coordenador", "professor"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type NewBookingFormValues = z.infer<typeof newBookingSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
