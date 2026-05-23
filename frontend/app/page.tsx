import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-jdm-gelo px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft lg:flex-row lg:items-center">
        <div className="space-y-8 lg:max-w-xl">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-jdm-azul px-4 py-3 text-white shadow-lg">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-jdm-azul-medio text-sm font-bold">JDM</span>
            <span className="text-sm font-semibold">EE Jeminiano David Müzel</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight text-jdm-azul sm:text-5xl">
              Sistema de Agendamento de Informática
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Agende tablets, chromebooks, notebooks e computadores com um painel moderno para professores e coordenação.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/login">
              <Button>Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] bg-jdm-azul p-10 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-jdm-gelo">Agendamento escolar</p>
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl bg-jdm-azul-medio/10 p-5">
              <p className="text-sm text-jdm-gelo">Equipamentos disponíveis</p>
              <p className="mt-3 text-3xl font-semibold">335 dispositivos</p>
            </div>
            <div className="rounded-3xl bg-jdm-azul-medio/10 p-5">
              <p className="text-sm text-jdm-gelo">Gestão de agendamentos</p>
              <p className="mt-3 text-3xl font-semibold">Rápida e segura</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
