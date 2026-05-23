"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import PageShell from "@/components/PageShell";
import ConfirmModal from "@/components/ConfirmModal";
import StatusBadge from "@/components/StatusBadge";
import { initialEquipamentos } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Booking = {
  id: string;
  equipamento: string;
  dataInicio: string;
  dataFim: string;
  quantidade: number;
  status: string;
  usuario?: { name?: string; email?: string };
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchDate = dateFilter ? booking.dataInicio.slice(0, 10) === dateFilter : true;
        const matchEquip = equipmentFilter ? booking.equipamento === equipmentFilter : true;
        return matchDate && matchEquip;
      }),
    [bookings, dateFilter, equipmentFilter]
  );

  async function loadBookings() {
    setLoading(true);
    try {
      const response = await api.get("/agendamentos", {
        params: { date: dateFilter || undefined, equipamento: equipmentFilter || undefined },
      });
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!selectedBooking) return;
    setLoadingCancel(true);
    try {
      await api.patch(`/agendamentos/${selectedBooking.id}`, { status: "cancelado" });
      setStatusMessage("Agendamento cancelado com sucesso.");
      setBookings((current) =>
        current.map((booking) =>
          booking.id === selectedBooking.id ? { ...booking, status: "cancelado" } : booking
        )
      );
    } catch {
      setStatusMessage("Não foi possível cancelar o agendamento.");
    } finally {
      setSelectedBooking(null);
      setLoadingCancel(false);
    }
  }

  return (
    <PageShell title="Painel da Coordenação" description="Gerencie todos os agendamentos e acompanhe o status dos equipamentos na escola.">
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <Card>
            <CardContent>
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Agendamentos</h2>
                  <p className="text-sm text-slate-600">Filtre por data e equipamento.</p>
                </div>
                <Button onClick={loadBookings}>Atualizar</Button>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <label className="grid gap-2 text-sm font-semibold text-slate-800">
                  Data
                  <Input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-800">
                  Equipamento
                  <Select value={equipmentFilter} onChange={(event) => setEquipmentFilter(event.target.value)}>
                    <option value="">Todos</option>
                    {initialEquipamentos.map((equip) => (
                      <option key={equip.id} value={equip.nome}>
                        {equip.nome}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900">Resumo dos equipamentos</h2>
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead>Equipamento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Em uso</TableHead>
                      <TableHead>Em reparo</TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {initialEquipamentos.map((equip) => (
                      <TableRow key={equip.id}>
                        <TableCell>{equip.nome}</TableCell>
                        <TableCell>{equip.tipo}</TableCell>
                        <TableCell>{equip.local}</TableCell>
                        <TableCell>{equip.total}</TableCell>
                        <TableCell>{equip.emUso}</TableCell>
                        <TableCell>{equip.reparo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Lista completa de agendamentos</h2>
                <p className="text-sm text-slate-600">Proteja a agenda da escola com cancelamentos rápidos.</p>
              </div>
            </div>
            {statusMessage ? (
              <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {statusMessage}
              </div>
            ) : null}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Data</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Qtd.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-4 py-5 text-slate-600">
                        Carregando agendamentos...
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-4 py-5 text-slate-600">
                        Nenhum agendamento encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{new Date(booking.dataInicio).toLocaleString("pt-BR")}</TableCell>
                        <TableCell>{booking.equipamento}</TableCell>
                        <TableCell>{booking.usuario?.name ?? booking.usuario?.email ?? "—"}</TableCell>
                        <TableCell>{booking.quantidade}</TableCell>
                        <TableCell><StatusBadge status={booking.status} /></TableCell>
                        <TableCell>
                          <Button onClick={() => setSelectedBooking(booking)} className="bg-rose-600 hover:bg-rose-500 text-sm py-2 px-3">
                            Cancelar
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
      <ConfirmModal
        open={selectedBooking !== null}
        title="Cancelar agendamento"
        description="Tem certeza de que deseja cancelar este agendamento? Esta ação não poderá ser desfeita."
        onCancel={() => setSelectedBooking(null)}
        onConfirm={handleCancel}
      />
    </PageShell>
  );
}
