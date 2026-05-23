"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { userSchema, type UserFormValues } from "@/lib/validations";
import PageShell from "@/components/PageShell";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "coordenador" | "professor";
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "professor",
    },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await api.get("/usuarios");
      const data = response.data;
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch {
      setUsers([]);
    }
  }

  async function onSubmit(values: UserFormValues) {
    try {
      const response = await api.post("/usuarios", values);
      setUsers((current) => [...current, response.data ?? { id: String(Date.now()), ...values }]);
      setNotification("Usuário criado com sucesso.");
      setDialogOpen(false);
      form.reset();
    } catch {
      setNotification("Não foi possível cadastrar o usuário.");
    }
  }

  async function deleteUser(id: string) {
    try {
      await api.delete(`/usuarios/${id}`);
      setUsers((current) => current.filter((user) => user.id !== id));
      setNotification("Usuário removido.");
    } catch {
      setNotification("Não foi possível remover o usuário.");
    }
  }

  return (
    <PageShell title="Usuários" description="Gerencie os usuários do sistema (admin apenas).">
      <div className="space-y-6">
        {notification ? (
          <div className="rounded-3xl border border-jdm-verde bg-jdm-verde/10 px-4 py-3 text-sm text-jdm-azul">
            {notification}
          </div>
        ) : null}
        <Card>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Cadastro de usuários</h2>
                <p className="text-sm text-slate-600">Adicione, edite e remova contas administrativas e docentes.</p>
              </div>
              <Button onClick={() => setDialogOpen(true)}>Novo usuário</Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Ações</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-4 py-5 text-slate-600">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Button onClick={() => deleteUser(user.id)} className="bg-rose-600 hover:bg-rose-500 text-sm py-2 px-3">
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen}>
        <DialogContent>
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Cadastrar usuário</h3>
              <p className="text-sm text-slate-600">Preencha os dados do novo usuário.</p>
            </div>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {form.formState.errors.name?.message ? <FormMessage>{form.formState.errors.name.message}</FormMessage> : null}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    {form.formState.errors.email?.message ? <FormMessage>{form.formState.errors.email.message}</FormMessage> : null}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="professor">Professor</option>
                        <option value="coordenador">Coordenador</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </FormControl>
                    {form.formState.errors.role?.message ? <FormMessage>{form.formState.errors.role.message}</FormMessage> : null}
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar usuário</Button>
              </div>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
