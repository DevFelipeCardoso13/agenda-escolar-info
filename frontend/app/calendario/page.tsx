"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import PageShell from "@/components/PageShell";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Booking = {
  id: string;
  equipamento: string;
  dataInicio: string;
  dataFim: string;
  quantidade: number;
  status: string;
};

function buildMonthDays(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const firstWeekday = start.getDay();
  const days: Array<Date | null> = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= end.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

export default function CalendarioPage() {
  const today = new Date();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/agendamentos");
        const data = response.data;
        if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch {
        setError("Não foi possível carregar o calendário de agendamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((booking) => {
      const day = booking.dataInicio.slice(0, 10);
      const existing = map.get(day) ?? [];
      map.set(day, [...existing, booking]);
    });
    return map;
  }, [bookings]);

  const selectedBookings = bookingsByDate.get(selectedDate) ?? [];
  const monthDays = buildMonthDays(today.getFullYear(), today.getMonth());

  return (
    <PageShell title="Calendário" description="Veja a distribuição dos agendamentos por dia e acompanhe o volume do mês.">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Mês atual</p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {today.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
                </h2>
              </div>
              <Button onClick={() => setSelectedDate(today.toISOString().slice(0, 10))} variant="secondary">
                Hoje
              </Button>
            </div>
            {loading ? (
              <p className="text-sm text-slate-600">Carregando calendário...</p>
            ) : error ? (
              <p className="text-sm text-rose-600">{error}</p>
            ) : (
              <div className="grid grid-cols-7 gap-3 text-center">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((label) => (
                  <div key={label} className="text-xs font-semibold uppercase text-slate-500">
                    {label}
                  </div>
                ))}
                {monthDays.map((date, index) => {
                  const dateKey = date ? date.toISOString().slice(0, 10) : null;
                  const count = dateKey ? bookingsByDate.get(dateKey)?.length ?? 0 : 0;
                  const isSelected = dateKey === selectedDate;
                  return (
                    <button
                      key={`${index}-${dateKey ?? 'empty'}`}
                      type="button"
                      disabled={!date}
                      onClick={() => dateKey && setSelectedDate(dateKey)}
                      className={`group min-h-[88px] rounded-3xl border px-3 py-4 text-left transition ${
                        date ? "bg-white hover:border-slate-300" : "cursor-default bg-transparent border-transparent"
                      } ${isSelected ? "border-jdm-azul bg-jdm-azul text-white" : "border-slate-200 text-slate-900"}`}
                    >
                      {date ? (
                        <>
                          <span className="block text-sm font-semibold">{date.getDate()}</span>
                          <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                            {count} agendamento{count === 1 ? "" : "s"}
                          </span>
                        </>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Agenda do dia</h2>
              <p className="text-sm text-slate-600">Mostrando agendamentos para {selectedDate}</p>
            </div>
            {selectedBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-jdm-gelo p-6 text-sm text-slate-600">
                Não há agendamentos para este dia.
              </div>
            ) : (
              <div className="space-y-4">
                {selectedBookings.map((booking) => (
                  <div key={booking.id} className="rounded-3xl border border-slate-200 bg-jdm-gelo p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{booking.equipamento}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(booking.dataInicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} -{' '}
                          {new Date(booking.dataFim).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-700">Quantidade: {booking.quantidade}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
