"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";

type PageShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-jdm-gelo text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-3xl font-semibold text-jdm-azul dark:text-jdm-gelo">{title}</h1>
                {description ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
