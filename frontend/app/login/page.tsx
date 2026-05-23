"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Toast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const [alert, setAlert] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      router.push(user?.type === "admin" ? "/admin" : "/dashboard");
    }
  }, [router]);

  async function onSubmit(values: LoginFormValues) {
    setAlert(null);
    try {
      const response = await api.post("/login", values);
      const result = response.data;
      const user = result.user ?? { email: values.email, name: values.email, type: result.type ?? "professor" };

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push(user.type === "admin" ? "/admin" : "/dashboard");
    } catch (error: any) {
      setAlert(error?.response?.data?.message || "Não foi possível fazer login. Verifique seus dados.");
    }
  }

  return (
    <main className="min-h-screen bg-jdm-azul px-4 py-10 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] bg-jdm-gelo/80 p-6 shadow-soft backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <section className="rounded-[2rem] bg-white p-10 shadow-soft sm:p-12">
          <div className="mb-8 inline-flex items-center gap-4 rounded-full bg-jdm-amarelo/10 px-4 py-3 text-sm font-semibold text-jdm-azul">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jdm-azul text-white">JDM</span>
            Sistema de Agendamento Escolar
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-jdm-azul sm:text-5xl">
            Bem-vindo ao painel da EE Jeminiano David Müzel
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            Faça login para acessar o controle de agendamentos, consultar equipamentos e gerenciar reservas em um ambiente seguro e otimizado.
          </p>
          <div className="mt-10 space-y-4 rounded-[2rem] border border-jdm-azul/10 bg-jdm-azul/5 p-6 text-sm text-slate-700">
            <p className="font-semibold text-jdm-azul">Dica Rápida</p>
            <p>Use o seu e-mail institucional para entrar. O sistema mantém o histórico de agendamentos para professores e coordenação.</p>
          </div>
        </section>

        <Card className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-soft dark:bg-slate-900 sm:p-10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-jdm-amarelo bg-jdm-azul text-3xl font-bold text-white">
              JDM
            </div>
            <CardTitle className="text-3xl">Entrar</CardTitle>
            <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">Acesse o sistema com seu login institucional.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <FormItem>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <>
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input id="email" placeholder="seu.email@escola.gov" {...field} />
                      </FormControl>
                      {form.formState.errors.email?.message ? (
                        <FormMessage>{form.formState.errors.email.message}</FormMessage>
                      ) : null}
                    </>
                  )}
                />
              </FormItem>
              <FormItem>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <>
                      <Label htmlFor="password">Senha</Label>
                      <FormControl>
                        <Input id="password" type="password" placeholder="Digite sua senha" {...field} />
                      </FormControl>
                      {form.formState.errors.password?.message ? (
                        <FormMessage>{form.formState.errors.password.message}</FormMessage>
                      ) : null}
                    </>
                  )}
                />
              </FormItem>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Entrar
              </Button>
            </Form>
            {alert ? <Toast message={alert} variant="error" /> : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
