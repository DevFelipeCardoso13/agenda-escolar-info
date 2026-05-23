"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Laptop2, CalendarDays, Box, BarChart3, Users } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

type UserData = {
  type?: string;
  role?: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      try {
        const user: UserData = JSON.parse(storedUser);
        setIsAdmin(user.type === "admin" || user.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  const links: NavLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: Laptop2 },
    { href: "/agendamentos/novo", label: "Novo Agendamento", icon: Box },
    { href: "/calendario", label: "Calendário", icon: CalendarDays },
    { href: "/equipamentos", label: "Equipamentos", icon: Box },
    { href: "/admin", label: "Relatórios", icon: BarChart3, adminOnly: true },
    { href: "/admin/usuarios", label: "Usuários", icon: Users, adminOnly: true },
  ];

  return (
    <aside className="hidden w-72 shrink-0 bg-jdm-azul px-4 py-8 text-white lg:block">
      <div className="mb-10 px-3">
        <div className="mb-4 flex items-center gap-3 rounded-3xl bg-jdm-azul-medio px-4 py-4 shadow-soft">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-jdm-amarelo bg-jdm-azul text-base font-bold">
            JDM
          </div>
          <div>
            <p className="text-sm font-semibold">EE Jeminiano David Müzel</p>
            <p className="text-xs text-jdm-gelo">Agendamento de Informática</p>
          </div>
        </div>
      </div>
      <nav className="space-y-2 px-3">
        {links.map((link) => {
          if (link.adminOnly && !isAdmin) return null;
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-jdm-medio text-white border-l-4 border-jdm-amarelo"
                  : "text-jdm-gelo hover:bg-jdm-medio/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
