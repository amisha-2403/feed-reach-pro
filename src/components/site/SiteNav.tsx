import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartCount();
  const dashboardPath = user ? ROLE_DASHBOARDS[user.role] : "/customer";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-surface/80 backdrop-blur-md dark:border-white/10 dark:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
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
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:text-brand dark:text-foreground md:inline-flex"
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
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-brand dark:text-foreground/80 md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="hidden rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground ring-1 ring-brand transition-transform hover:scale-[1.02] hover:bg-brand-light md:inline-flex"
              >
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-brand/10 hover:text-brand dark:text-foreground md:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Logo />
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-site-menu" className="border-t border-black/5 bg-surface px-4 py-3 shadow-lg dark:border-white/10 dark:bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={link.hash}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-brand/10 hover:text-brand dark:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {!isLoading && (
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-brand/10 hover:text-brand dark:text-foreground/80"
                  >
                    <span className="inline-flex items-center gap-2"><ShoppingCart className="size-4" /> Cart</span>
                    {cartCount > 0 && <span className="rounded-full bg-brand-accent px-2 py-0.5 text-xs font-bold text-brand-accent-foreground">{cartCount}</span>}
                  </Link>
                )}
                <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-brand/10 hover:text-brand dark:text-foreground/80">
                  Dashboard
                </Link>
                <button
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink/80 hover:bg-brand/10 hover:text-brand dark:text-foreground/80"
                  onClick={async () => {
                    try {
                      await logout();
                      setMobileMenuOpen(false);
                      navigate({ to: "/" });
                      toast.success("Signed out");
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Unable to sign out");
                    }
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-black/5 pt-3 dark:border-white/10">
                <Link to="/auth" search={{ mode: "signin" }} onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-brand px-4 py-2.5 text-center text-sm font-medium text-brand">Sign in</Link>
                <Link to="/auth" search={{ mode: "signup" }} onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-brand px-4 py-2.5 text-center text-sm font-medium text-brand-foreground">Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
