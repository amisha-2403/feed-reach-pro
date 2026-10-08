import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { ROLE_LABELS, type AppRole } from "@/lib/roles";
import { Logo } from "@/components/brand/Logo";

export function DashboardShell({
  role,
  title,
  description,
  children,
}: {
  role: AppRole;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { fullName, user } = useSession();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/80 backdrop-blur-md dark:border-white/10 dark:bg-background/70">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Logo />

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-medium uppercase tracking-wider text-ink-muted sm:inline">
              {ROLE_LABELS[role]}
            </span>
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-ink">{fullName ?? user?.email}</div>
              {fullName ? <div className="text-xs text-ink-muted">{user?.email}</div> : null}
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-foreground"
            >
              <LogOut className="size-4" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-medium tracking-wide text-brand">
            <span className="size-1.5 rounded-full bg-brand" />
            {ROLE_LABELS[role]} dashboard
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
}

export function DashboardGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-2xl bg-white p-6 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:ring-brand/30 dark:bg-card dark:ring-white/10"
        >
          <h3 className="mb-2 font-medium text-ink">{it.title}</h3>
          <p className="text-sm text-ink-muted">{it.body}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-brand/60">
            Coming soon
          </p>
        </div>
      ))}
    </div>
  );
}
