import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),

  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const bookingSchema = z
  .object({
    equipamentoId: z
      .string()
      .min(1, "Selecione um equipamento"),

    quantidade: z
      .number({
        invalid_type_error: "Digite uma quantidade válida",
      })
      .min(1, "Quantidade mínima é 1")
      .max(50, "Quantidade máxima é 50"),

    dataInicio: z
      .string()
      .min(1, "Informe a data e hora de início"),

    dataFim: z
      .string()
      .min(1, "Informe a data e hora de término"),

    observacao: z
      .string()
      .max(500, "Máximo de 500 caracteres")
      .optional(),
  })
  .refine(
    (data) =>
      new Date(data.dataInicio) <
      new Date(data.dataFim),
    {
      message:
        "A data final deve ser maior que a inicial",
      path: ["dataFim"],
    }
  );

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(255, "Nome muito grande"),

  email: z
    .string()
    .min(1, "Email obrigatório")
    .email("Email inválido"),

  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .optional(),

  role: z.enum(
    ["admin", "coordenador", "professor"],
    {
      errorMap: () => ({
        message: "Selecione um tipo de usuário",
      }),
    }
  ),

  telefone: z
    .string()
    .max(20, "Telefone inválido")
    .optional(),
});

export type LoginFormValues =
  z.infer<typeof loginSchema>;

export type BookingFormValues =
  z.infer<typeof bookingSchema>;

export type UserFormValues =
  z.infer<typeof userSchema>;