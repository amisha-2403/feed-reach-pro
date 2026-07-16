import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Store,
  Truck,
  ShieldCheck,
  IndianRupee,
  Search,
  Star,
  Package,
  ClipboardCheck,
  Bike,
} from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { CATEGORIES, FEATURED_PRODUCTS, TESTIMONIALS } from "@/lib/marketplace-data";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — GramSetu" },
      {
        name: "description",
        content:
          "Shop animal feed, seeds, fertilizers, farm produce and daily agricultural essentials from trusted local sellers on GramSetu.",
      },
      { property: "og:title", content: "GramSetu Marketplace — Village to Village, Hand to Hand" },
      {
        property: "og:description",
        content:
          "Hyperlocal rural commerce. Buy directly from farmers and local shops with same-day village delivery.",
      },
    ],
  }),
  component: MarketplacePage,
});

const whyCards = [
  {
    icon: Store,
    title: "Trusted Local Sellers",
    body: "Every shop and farmer on GramSetu is verified through in-person visits and community references.",
  },
  {
    icon: Truck,
    title: "Hyperlocal Delivery",
    body: "Orders reach your doorstep the same day through delivery partners who know every village lane.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Farmers",
    body: "Farm produce is traceable to the field with quality tags and batch numbers on every parcel.",
  },
  {
    icon: IndianRupee,
    title: "Affordable Prices",
    body: "No middlemen, no markups — direct pricing from the source keeps rural households in control.",
  },
];

const howSteps = [
  { n: 1, icon: Search, title: "Browse Products", body: "Discover feed, seeds and essentials from sellers around you." },
  { n: 2, icon: ClipboardCheck, title: "Place Order", body: "Add to cart and confirm — pay online or on delivery." },
  { n: 3, icon: Package, title: "Shop Packs Order", body: "The local shop or farmer prepares your order with care." },
  { n: 4, icon: Bike, title: "Delivery Partner Delivers", body: "A trusted rider brings it to your gate the same day." },
];

function MarketplacePage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 via-surface to-surface py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-brand-accent/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
                <span className="size-1.5 rounded-full bg-brand" />
                Rural marketplace · Live in your district
              </span>
              <h1 className="mb-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Everything Your Farm Needs, <span className="text-brand">All in One Place.</span>
              </h1>
              <p className="mb-8 max-w-[54ch] text-pretty text-base text-ink-muted sm:text-lg">
                Buy animal feed, seeds, fertilizers, farm produce and agricultural essentials
                directly from trusted local sellers.
              </p>

              <div className="mb-8 flex flex-wrap items-center gap-3">
                <a
                  href="#featured"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground shadow-sm ring-1 ring-brand transition-all hover:bg-brand-light hover:shadow-md"
                >
                  Explore Marketplace
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-brand/30 hover:text-brand dark:border-white/15 dark:bg-white/5 dark:text-foreground"
                >
                  Become a Seller
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-ink-muted">
                <StatBadge value="500+" label="Villages Served" />
                <StatBadge value="1,200+" label="Local Sellers" />
                <StatBadge value="4.8★" label="Customer Rating" />
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="relative overflow-hidden rounded-3xl bg-zinc-100 shadow-[0_30px_80px_-30px_rgba(26,77,46,0.35)] ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&auto=format&fit=crop&q=70"
                  alt="Rural farmer holding fresh farm produce"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-surface p-4 shadow-xl ring-1 ring-black/5 sm:flex sm:items-center sm:gap-3 dark:bg-card dark:ring-white/10">
                <div className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Truck className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs font-medium text-ink">Same-day delivery</p>
                  <p className="text-[11px] text-ink-muted">Across 500+ villages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Categories"
            title="Shop by category"
            subtitle="From feed sacks to fresh produce — everything a rural household needs."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#featured`}
                className={`group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br ${c.accent} p-5 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-card dark:from-transparent dark:to-transparent dark:ring-white/10`}
              >
                <div className="grid size-12 place-items-center rounded-xl bg-surface text-brand shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-110 dark:bg-background dark:ring-white/10">
                  <c.icon className="size-6" strokeWidth={1.75} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-ink">{c.name}</p>
                  <p className="text-[11px] text-ink-muted">{c.count} items</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="bg-accent/30 py-20 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-brand">
                Featured
              </span>
              <h2 className="text-balance text-3xl font-semibold text-ink sm:text-4xl">
                Handpicked from local sellers
              </h2>
            </div>
            <a
              href="#categories"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-light"
            >
              View all products <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why GramSetu */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Why GramSetu"
            title="Built on rural trust, powered by technology"
            subtitle="Four reasons households, farmers and shops rely on GramSetu every day."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((w) => (
              <div
                key={w.title}
                className="group relative overflow-hidden rounded-2xl bg-surface p-6 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-brand/25 dark:bg-card dark:ring-white/10"
              >
                <div className="mb-5 grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <w.icon className="size-6" strokeWidth={1.75} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ink">{w.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-accent/30 py-20 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="How it works"
            title="From click to doorstep in four simple steps"
            subtitle="A transparent flow that keeps every side of the supply chain in sync."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howSteps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="h-full rounded-2xl bg-surface p-6 ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-brand text-brand-foreground">
                      <s.icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <span className="tabular-nums text-3xl font-semibold text-brand/25">
                      0{s.n}
                    </span>
                  </div>
                  <h4 className="mb-2 text-base font-semibold text-ink">{s.title}</h4>
                  <p className="text-sm leading-relaxed text-ink-muted">{s.body}</p>
                </div>
                {i < howSteps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden size-6 -translate-y-1/2 text-brand/30 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Customer stories"
            title="Trusted by villages across India"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col gap-6 rounded-2xl bg-surface p-8 ring-1 ring-black/5 transition-shadow hover:shadow-lg dark:bg-card dark:ring-white/10"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-brand-accent text-brand-accent" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="text-pretty text-sm leading-relaxed text-ink/90">
                  "{t.quote}"
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-black/5 pt-5 dark:border-white/10">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="size-11 rounded-full object-cover ring-2 ring-brand/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-muted">
                      {t.role} · {t.village}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-brand">
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-pretty text-base text-ink-muted">{subtitle}</p>}
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold text-ink">{value}</span>
      <span className="text-ink-muted">{label}</span>
    </div>
  );
}
