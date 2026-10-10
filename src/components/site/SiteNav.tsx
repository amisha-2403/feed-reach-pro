import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Mail, Phone } from "lucide-react";
import { useAuth } from "@/components/auth/UseAuth";
import { useCartCount } from "@/hooks/use-cart";
import { ROLE_DASHBOARDS, ROLE_LABELS } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";

const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Marketplace", to: "/marketplace" as const },
  { label: "Categories", to: "/marketplace" as const, hash: "categories" },
  { label: "Orders", to: "/marketplace" as const, hash: "featured" },
  { label: "About", to: "/about-us" as const },
];

export function SiteNav() {
  const { user, isLoading } = useAuth();
  const cartCount = useCartCount();
  const navigate = useNavigate();
  const dashboardPath = user ? ROLE_DASHBOARDS[user.role] : "/customer";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-surface/80 backdrop-blur-md dark:border-white/10 dark:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                hash={l.hash}
                className="text-sm font-medium text-ink/70 transition-colors hover:text-brand dark:text-foreground/70"
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-brand" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-brand/10 hover:text-brand dark:text-foreground"
          >
            <ShoppingCart className="size-4" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-brand-accent px-1 text-[10px] font-bold leading-4 text-brand-accent-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoading ? (
            <div className="hidden h-7 w-24 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
          ) : user ? (
            <>
              <span className="hidden text-xs font-medium text-ink-muted sm:inline">
                {user.role ? ROLE_LABELS[user.role] : ""}
              </span>
              <Link
                to={dashboardPath}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:text-brand dark:text-foreground"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {}}
                className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground ring-1 ring-brand transition-transform hover:scale-[1.02] hover:bg-brand-light"
                aria-label="Account"
              >
                {/* User initials or avatar */}
                {user.name ? user.name.split(" ").map((n) => n[0]).join("") : "U"}
              </button>
              {/* Cart count badge */}
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-brand-accent px-1 text-[10px] font-bold leading-4 text-brand-accent-foreground">
                  {cartCount}
                </span>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-brand dark:text-foreground/80"
              >
                Sign in
              </Link>
              <Link
                to="/register"
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