import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-surface pt-20 pb-8 dark:border-white/10 dark:bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
              GramSetu — Village to Village, Hand to Hand. A hyperlocal AgriTech bridge connecting
              farmers, shops, delivery partners, and rural households across India.
            </p>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink">
                Join our newsletter
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2 rounded-full border border-black/10 bg-surface p-1 pl-4 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <input
                  type="email"
                  required
                  placeholder="you@village.in"
                  className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid size-9 place-items-center rounded-full bg-brand text-brand-foreground transition-transform hover:scale-105"
                >
                  <Send className="size-4" strokeWidth={1.75} />
                </button>
              </form>
              <p className="mt-2 text-[11px] text-ink-muted">
                Rural commerce updates. No spam, unsubscribe anytime.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <SocialLink label="Facebook" icon={Facebook} />
              <SocialLink label="Instagram" icon={Instagram} />
              <SocialLink label="Twitter" icon={Twitter} />
              <SocialLink label="YouTube" icon={Youtube} />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <FooterColumn
              title="Company"
              links={["About", "Our Story", "Careers", "Press", "Blog"]}
            />
            <FooterColumn
              title="Marketplace"
              links={["Animal Feed", "Seeds", "Fertilizers", "Farm Produce", "Veterinary"]}
            />
            <FooterColumn
              title="Support"
              links={["Help Center", "Shipping", "Returns", "Order Tracking", "Sellers"]}
            />
            <div className="flex flex-col gap-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ink">Contact</h5>
              <ContactLine icon={Mail} label="hello@gramsetu.in" />
              <ContactLine icon={Phone} label="+91 98765 43210" />
              <ContactLine icon={MapPin} label="Pune, Maharashtra 411001" />
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

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-3">
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

function SocialLink({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full bg-brand/5 text-brand ring-1 ring-brand/15 transition-all hover:bg-brand hover:text-brand-foreground hover:ring-brand"
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </a>
  );
}
