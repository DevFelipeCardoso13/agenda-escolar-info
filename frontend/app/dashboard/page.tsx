"use client";

import { useEffect, useMemo, useState } from "react";
import { Laptop2, CalendarDays, Wrench, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import PageShell from "@/components/PageShell";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initialEquipamentos } from "@/lib/mockData";

const totalEquipamentos = 335;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Booking = {
  id: string;
  equipamento: string;
  dataInicio: string;
  dataFim: string;
  quantidade: number;
  status: string;
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/agendamentos", { params: { mine: true } });
        const data = response.data;
        if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch {
        setError("Não foi possível carregar seus agendamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const bookingCountToday = bookings.filter((booking) => booking.dataInicio.slice(0, 10) === today).length;
  const nextBooking = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((item) => new Date(item.dataInicio) >= now)
      .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())[0];
  }, [bookings]);

  const totalManutencao = initialEquipamentos.reduce((acc, equip) => acc + equip.reparo, 0);
  const totalDisponiveis = initialEquipamentos.reduce((acc, equip) => acc + (equip.total - equip.emUso), 0);

  const stats = [
    {
      label: "Total de equipamentos",
      value: totalEquipamentos,
      icon: Laptop2,
      color: "border-jdm-azul",
      description: "Dispositivos cadastrados no sistema",
    },
    {
      label: "Agendamentos hoje",
      value: bookingCountToday,
      icon: CalendarDays,
      color: "border-jdm-medio",
      description: "Reservas previstas para hoje",
    },
    {
      label: "Em manutenção",
      value: totalManutencao,
      icon: Wrench,
      color: "border-jdm-amarelo",
      description: "Atenção ao estado dos equipamentos",
    },
    {
      label: "Disponíveis agora",
      value: totalDisponiveis,
      icon: CheckCircle2,
      color: "border-jdm-verde",
      description: "Recursos prontos para uso",
    },
  ];

  return (
    <PageShell title="Dashboard" description="Resumo dos seus agendamentos e acesso rápido às ações mais importantes.">
      <div className="grid gap-6 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`border-t-4 ${stat.color}`}>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-600">{stat.description}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-jdm-gelo text-jdm-azul">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="space-y-6">
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Meus agendamentos</h2>
                  <p className="text-sm text-slate-600">Veja os próximos horários e organize sua rotina.</p>
                </div>
                <Button onClick={() => router.push("/agendamentos/novo")}>Novo agendamento</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-600">Carregando...</p>
              ) : error ? (
                <p className="text-sm text-rose-600">{error}</p>
              ) : bookings.length === 0 ? (
                <p className="text-sm text-slate-600">Nenhum agendamento encontrado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-slate-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 font-semibold">Data</th>
                        <th className="px-4 py-3 font-semibold">Equipamento</th>
                        <th className="px-4 py-3 font-semibold">Qtd.</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-4 py-4">{formatDate(booking.dataInicio)}</td>
                          <td className="px-4 py-4">{booking.equipamento}</td>
                          <td className="px-4 py-4">{booking.quantidade}</td>
                          <td className="px-4 py-4"> <StatusBadge status={booking.status} /> </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        <section className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold text-slate-900">Próximo agendamento</h2>
              {nextBooking ? (
                <div className="mt-4 rounded-3xl border border-slate-200 bg-jdm-gelo p-5">
                  <p className="font-semibold text-slate-900">{nextBooking.equipamento}</p>
                  <p className="mt-2 text-sm text-slate-600">{formatDate(nextBooking.dataInicio)}</p>
                  <p className="mt-2 text-sm text-slate-700">Quantidade: {nextBooking.quantidade}</p>
                  <div className="mt-3"> <StatusBadge status={nextBooking.status} /> </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">Nenhum agendamento futuro programado.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}
