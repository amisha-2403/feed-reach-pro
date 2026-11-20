import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/UseAuth";
import { useCartCount } from "@/hooks/use-cart";
import { ROLE_DASHBOARDS, ROLE_LABELS } from "@/lib/roles";
import { Logo } from "@/components/brand/Logo";

const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Animal Husbandry", to: "/marketplace" as const },
  { label: "Categories", to: "/categories" as const },
  { label: "Orders", to: "/marketplace" as const, hash: "featured" },
  { label: "About", to: "/about-us" as const },
];

export function SiteNav() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const cartCount = useCartCount();
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
          {!isLoading && user && (
            <Link
              to="/cart"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="relative grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-brand/10 hover:text-brand dark:text-foreground"
            >
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-brand-accent px-1 text-[10px] font-bold leading-4 text-brand-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

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
              <div className="relative">
                <button
                  className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground ring-1 ring-brand transition-transform hover:scale-[1.02] hover:bg-brand-light"
                  aria-label="Account menu"
                  aria-expanded={accountMenuOpen}
                  title={user.name}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                >
                  {user.name ? user.name.split(" ").map((n) => n[0]).join("") : "U"}
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-black/10 bg-surface p-2 shadow-xl dark:border-white/10 dark:bg-card">
                    <p className="truncate px-2 py-1 text-xs text-ink-muted">{user.email}</p>
                    <button
                      className="w-full rounded-lg px-2 py-2 text-left text-sm text-ink hover:bg-brand/10 hover:text-brand dark:text-foreground"
                      onClick={async () => {
                        try {
                          await logout();
                          setAccountMenuOpen(false);
                          navigate({ to: "/" });
                          toast.success("Signed out");
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "Unable to sign out");
                        }
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
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
