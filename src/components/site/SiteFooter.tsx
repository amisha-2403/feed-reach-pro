export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-surface py-16 dark:border-white/10 dark:bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="flex max-w-sm flex-col gap-4">
            <span className="font-semibold text-brand">GramSetu</span>
            <p className="text-sm text-ink-muted">
              Supporting rural economies through smarter animal nutrition supply chains — from the
              farm gate to the feeding trough.
            </p>
          </div>
          <div className="flex gap-12 md:gap-24">
            <FooterColumn
              title="Company"
              links={["About", "Network", "Careers", "Contact"]}
            />
            <FooterColumn title="Platform" links={["For Shops", "For Farmers", "For Delivery", "Coverage"]} />
            <FooterColumn title="Legal" links={["Privacy", "Terms", "Compliance"]} />
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 md:flex-row dark:border-white/10">
          <span className="text-xs text-ink-muted">
            © {new Date().getFullYear()} GramSetu Technologies. All rights reserved.
          </span>
          <span className="text-xs text-ink-muted">Built for rural India · v0.1</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{title}</h5>
      {links.map((l) => (
        <a
          key={l}
          href="#"
          className="text-sm text-ink/75 transition-colors hover:text-brand dark:text-foreground/75"
        >
          {l}
        </a>
      ))}
    </div>
  );
}
