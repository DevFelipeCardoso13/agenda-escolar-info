"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/api";

import {
  bookingSchema,
  type BookingFormValues,
} from "@/lib/validations";

import { initialEquipamentos } from "@/lib/mockData";

import PageShell from "@/components/PageShell";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function NovoAgendamentoPage() {
  const [equipamentos, setEquipamentos] =
    useState<any[]>(initialEquipamentos);

  const [confirmOpen, setConfirmOpen] =
    useState(false);
  const [pendingValues, setPendingValues] =
    useState<BookingFormValues | null>(null);

  const { toast, ToastViewport } = useToast();

  const form =
    useForm<BookingFormValues>({
      resolver: zodResolver(
        bookingSchema
      ),

      defaultValues: {
        equipamentoId: "",
        quantidade: 1,
        dataInicio: "",
        dataFim: "",
        observacao: "",
      },
    });

  useEffect(() => {
    async function fetchEquipamentos() {
      try {
        const response =
          await api.get(
            "/equipamentos"
          );

        const data = response.data;

        if (Array.isArray(data)) {
          setEquipamentos(
            data.map((item: any) => ({
              id:
                item.id?.toString() ??
                item.nome,

              nome:
                item.nome ?? item,

              disponivel:
                item.qtd_total &&
                  item.qtd_em_uso
                  ? item.qtd_total -
                  item.qtd_em_uso
                  : null,
            }))
          );
        }
      } catch {
        setEquipamentos(
          initialEquipamentos.map(
            (item) => ({
              id: item.id.toString(),
              nome: item.nome,
            })
          )
        );
      }
    }

    fetchEquipamentos();
  }, []);

  async function submitBooking(values: BookingFormValues) {
    form.clearErrors("root");

    try {
      await api.post("/agendamentos", values);

      toast({
        message: "Agendamento criado com sucesso.",
        variant: "success",
      });

      form.reset();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Não foi possível criar o agendamento.";

      const rootMessage =
        message
          .toString()
          .toLowerCase()
          .includes("conflito")
          ? "Conflito de horário detectado."
          : "Não foi possível criar o agendamento.";

      form.setError("root", {
        type: "server",
        message: rootMessage,
      });

      toast({
        message: rootMessage,
        variant: "error",
      });
    }
  }

  const handleOpenConfirm = form.handleSubmit((values) => {
    form.clearErrors("root");
    setPendingValues(values);
    setConfirmOpen(true);
  });

  async function handleConfirmSubmit() {
    if (!pendingValues) {
      return;
    }

    setConfirmOpen(false);
    await submitBooking(pendingValues);
    setPendingValues(null);
  }

  return (
    <PageShell
      title="Novo Agendamento"
      description="Agende equipamentos com segurança e controle de horários."
    >
      <Card>
        <CardContent className="pt-6">
          <ToastViewport />

          <Form onSubmit={handleOpenConfirm} className="space-y-6">
              <FormField
                control={form.control}
                name="equipamentoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Equipamento
                    </FormLabel>

                    <Select
                      onValueChange={
                        field.onChange
                      }
                      value={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um equipamento" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {equipamentos.map(
                          (equip) => (
                            <SelectItem
                              key={
                                equip.id
                              }
                              value={
                                equip.id
                              }
                            >
                              {equip.nome}

                              {equip.disponivel !==
                                null &&
                                ` (${equip.disponivel} disponíveis)`}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Quantidade
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(
                          e
                        ) =>
                          field.onChange(
                            Number(
                              e.target
                                .value
                            )
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <FormField
                  control={
                    form.control
                  }
                  name="dataInicio"
                  render={({
                    field,
                  }) => (
                    <FormItem>
                      <FormLabel>
                        Início
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={
                    form.control
                  }
                  name="dataFim"
                  render={({
                    field,
                  }) => (
                    <FormItem>
                      <FormLabel>
                        Fim
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Informações adicionais"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root?.message && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {form.formState.errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState
                  .isSubmitting
                  ? "Agendando..."
                  : "Confirmar agendamento"}
              </Button>
          </Form>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar agendamento</DialogTitle>
                <DialogDescription>
                  Deseja realmente criar este agendamento? Verifique datas e equipamento antes de confirmar.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-4 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={form.formState.isSubmitting}
                >
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </PageShell>
  );
}