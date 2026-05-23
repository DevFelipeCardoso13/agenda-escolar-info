"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

type UserData = {
  name?: string;
  email?: string;
};

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      try {
        const user: UserData = JSON.parse(storedUser);
        setUserName(user.name || user.email || "Usuário");
      } catch {
        setUserName("Usuário");
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <header className="bg-jdm-azul text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-jdm-amarelo bg-jdm-azul text-lg font-bold text-white">
            JDM
          </div>
          <div>
            <p className="text-base font-bold">EE Jeminiano David Müzel</p>
            <p className="text-sm text-jdm-gelo">Sistema de Agendamento</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end sm:flex-row sm:gap-4">
          <div className="text-sm">
            <p className="font-semibold">{userName}</p>
            <span className="text-jdm-gelo">Conectado</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
