import { Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-surface pt-20 pb-8 dark:border-white/10 dark:bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-12 lg:col-span-12">
            <FooterColumn
              title="Company"
              links={["About", "Our Story", "Careers"]}
              className="lg:col-span-3"
            />
            <FooterColumn
              title="Marketplace"
              links={["Animal Feed", "Seeds", "Fertilizers", "Farm Produce", "Veterinary"]}
              className="lg:col-span-3"
            />
            <FooterColumn
              title="Support"
              links={["Help Center", "Shipping", "Returns", "Order Tracking", "Sellers"]}
              className="lg:col-span-3"
            />
            <div className="flex flex-col gap-3 lg:col-span-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ink">Contact</h5>
              <ContactLine icon={Mail} label="gramsetu@gmail.com" />
              <ContactLine icon={Phone} label="+91 98765 43210" />
              <ContactLine icon={MapPin} label="Jaipur, Rajasthan" />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 md:flex-row dark:border-white/10">
          <span className="text-xs text-ink-muted">
            © {new Date().getFullYear()} GramSetu Technologies Pvt. Ltd. · Made in Bharat
          </span>
          <div className="flex items-center gap-6 text-xs text-ink-muted">
            <a href="#" className="hover:text-brand">Privacy</a>
            <a href="#" className="hover:text-brand">Terms</a>
            <a href="#" className="hover:text-brand">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, className = "" }: {
  title: string;
  links: string[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <h5 className="text-xs font-semibold uppercase tracking-wider text-ink">{title}</h5>
      {links.map((l) => (
        <a
          key={l}
          href="#"
          className="text-sm text-ink/70 transition-colors hover:text-brand dark:text-foreground/70"
        >
          {l}
        </a>
      ))}
    </div>
  );
}

function ContactLine({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink/70 dark:text-foreground/70">
      <Icon className="size-4 text-brand" strokeWidth={1.75} />
      {label}
    </span>
  );
}
