import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo, LogoMark } from "@/components/brand/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-0 px-6 py-10 lg:grid-cols-2 lg:gap-12">
        {/* Left brand rail */}
        <aside className="hidden flex-col justify-between rounded-3xl bg-brand p-10 text-brand-foreground shadow-[0_30px_80px_-30px_rgba(26,77,46,0.5)] lg:flex">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium">
            <span aria-hidden className="grid size-7 place-items-center rounded-xl bg-brand-foreground/15">
              <LogoMark size={22} />
            </span>
            GramSetu
          </Link>
          <div>
            <h2 className="text-balance text-3xl font-semibold leading-tight">
              The direct line from farm to trough.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-brand-foreground/75">
              Join the hyperlocal supply chain built for village feed shops, livestock farmers,
              and delivery partners.
            </p>
          </div>
          <p className="text-xs text-brand-foreground/60">
            © {new Date().getFullYear()} GramSetu
          </p>
        </aside>

        {/* Right form area */}
        <main className="flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand lg:hidden"
            >
              <span aria-hidden className="grid size-6 place-items-center rounded-md bg-brand/10">
                <span className="size-2 rounded-full bg-brand" />
              </span>
              GramSetu
            </Link>
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-ink">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
            ) : null}
            <div className="mt-8">{children}</div>
            {footer ? <div className="mt-6 text-sm text-ink-muted">{footer}</div> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
