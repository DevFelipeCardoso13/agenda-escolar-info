"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { newBookingSchema, type NewBookingFormValues } from "@/lib/validations";
import { initialEquipamentos } from "@/lib/mockData";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

export default function NovoAgendamentoPage() {
  const [equipamentos, setEquipamentos] = useState(initialEquipamentos);
  const [notification, setNotification] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const form = useForm<NewBookingFormValues>({
    resolver: zodResolver(newBookingSchema),
    defaultValues: {
      equipamentoId: "",
      quantidade: 1,
      dataInicio: "",
      dataFim: "",
      observacao: "",
    },
  });

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const response = await api.get("/equipamentos");
        const data = response.data;
        if (Array.isArray(data)) {
          setEquipamentos(data.map((item: any) => ({ id: item.id?.toString() ?? item.nome, nome: item.nome ?? item }))); 
        }
      } catch {
        setEquipamentos(initialEquipamentos.map((item) => ({ id: item.id.toString(), nome: item.nome })));
      }
    };

    fetchEquipamentos();
  }, []);

  async function onSubmit(values: NewBookingFormValues) {
    setNotification(null);
    try {
      await api.post("/agendamentos", values);
      setNotification({ message: "Agendamento criado com sucesso.", variant: "success" });
      form.reset();
    } catch (error: any) {
      const message = error?.response?.data?.message;
      setNotification({
        message: message?.toLowerCase().includes("conflito")
          ? "Conflito de horário: verifique outros agendamentos no mesmo período."
          : "Não foi possível criar o agendamento. Tente novamente.",
        variant: "error",
      });
    }
  }

  return (
    <PageShell title="Novo Agendamento" description="Agende equipamentos com segurança e controle de horários.">
      <Card>
        <CardContent>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="equipamentoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="">Selecione um equipamento</option>
                      {equipamentos.map((equip) => (
                        <option key={equip.id} value={equip.id}>
                          {equip.nome}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  {form.formState.errors.equipamentoId?.message ? (
                    <FormMessage>{form.formState.errors.equipamentoId.message}</FormMessage>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  {form.formState.errors.quantidade?.message ? (
                    <FormMessage>{form.formState.errors.quantidade.message}</FormMessage>
                  ) : null}
                </FormItem>
              )}
            />
            <div className="grid gap-5 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    {form.formState.errors.dataInicio?.message ? (
                      <FormMessage>{form.formState.errors.dataInicio.message}</FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    {form.formState.errors.dataFim?.message ? (
                      <FormMessage>{form.formState.errors.dataFim.message}</FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação (opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Informações adicionais do agendamento" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Agendar equipamento
            </Button>
          </Form>
          {notification ? <Toast message={notification.message} variant={notification.variant} /> : null}
        </CardContent>
      </Card>
    </PageShell>
  );
}
