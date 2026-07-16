import { Link, useNavigate } from "@tanstack/react-router";
import { useSession } from "@/hooks/use-session";
import { ROLE_DASHBOARDS, ROLE_LABELS } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";

const roleLinks = [
  { label: "Customer", href: "#customer" },
  { label: "Shop", href: "#shop" },
  { label: "Farmer", href: "#farmer" },
  { label: "Delivery", href: "#delivery" },
];

export function SiteNav() {
  const { loading, user, role } = useSession();
  const navigate = useNavigate();
  const dashboardPath = role ? ROLE_DASHBOARDS[role] : "/customer";

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-surface/80 backdrop-blur-md dark:border-white/10 dark:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-brand transition-opacity hover:opacity-80"
          >
            <span aria-hidden className="grid size-6 place-items-center rounded-md bg-brand/10">
              <span className="size-2 rounded-full bg-brand" />
            </span>
            <span className="font-semibold tracking-tight">GramSetu</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {roleLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-ink/70 transition-colors hover:text-brand dark:text-foreground/70"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-7 w-24 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
          ) : user ? (
            <>
              <span className="hidden text-xs font-medium text-ink-muted sm:inline">
                {role ? ROLE_LABELS[role] : ""}
              </span>
              <Link
                to={dashboardPath}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:text-brand dark:text-foreground"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground ring-1 ring-brand transition-transform hover:scale-[1.02] hover:bg-brand-light"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-brand dark:text-foreground/80"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground ring-1 ring-brand transition-transform hover:scale-[1.02] hover:bg-brand-light"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
