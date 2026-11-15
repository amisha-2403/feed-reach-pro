import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Package,
  Network,
  BadgeCheck,
  IndianRupee,
  Sparkles,
  Leaf,
  Wheat,
  Sprout,
  FlaskConical,
  Apple,
  Stethoscope,
  Tractor,
  MousePointerClick,
  ShoppingBag,
  CheckCircle2,
  Bike,
  Home,
} from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GramSetu — Village to Village, Hand to Hand" },
      {
        name: "description",
        content:
          "GramSetu connects villages through agriculture. Buy animal feed, seeds, fertilizers and farm produce directly from trusted farmers and local shops with same-day rural delivery.",
      },
      { property: "og:title", content: "GramSetu — Village to Village, Hand to Hand" },
      {
        property: "og:description",
        content:
          "GramSetu connects villages through agriculture. Buy animal feed, seeds, fertilizers and farm produce directly from trusted farmers and local shops with same-day rural delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "20+", label: "Villages Connected", icon: Network },
  { value: "500+", label: "Farmers", icon: Sprout },
  { value: "200+", label: "Local Shops", icon: ShoppingBag },
  { value: "5,000+", label: "Products Listed", icon: Package },
  { value: "98%", label: "Customer Satisfaction", icon: Sparkles },
];

const featuredCategories = [
  {
    id: "animal-feed",
    name: "Animal Feed",
    tag: "Livestock nutrition",
    icon: Wheat,
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=70",
    tint: "from-amber-500/20 to-transparent",
  },
  {
    id: "seeds",
    name: "Seeds",
    tag: "Certified varieties",
    icon: Sprout,
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=70",
    tint: "from-emerald-500/20 to-transparent",
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    tag: "Organic & chemical",
    icon: FlaskConical,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=70",
    tint: "from-lime-500/20 to-transparent",
  },
  {
    id: "produce",
    name: "Farm Produce",
    tag: "Fresh from field",
    icon: Apple,
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=70",
    tint: "from-rose-500/20 to-transparent",
  },
  {
    id: "veterinary",
    name: "Veterinary Supplies",
    tag: "Livestock care",
    icon: Stethoscope,
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=70",
    tint: "from-sky-500/20 to-transparent",
  },
  {
    id: "organic",
    name: "Organic Farming",
    tag: "Chemical-free",
    icon: Leaf,
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop&q=70",
    tint: "from-teal-500/20 to-transparent",
  },
  {
    id: "essentials",
    name: "Farming Essentials",
    tag: "Tools & tackle",
    icon: Tractor,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=70",
    tint: "from-orange-500/20 to-transparent",
  },
];

const whyCards = [
  {
    icon: BadgeCheck,
    title: "Verified Sellers",
    body: "Every shop and farmer is verified in-person by our local field team before going live.",
  },
  {
    icon: IndianRupee,
    title: "Affordable Prices",
    body: "No middlemen. Direct source pricing keeps rural households and farmers in control.",
  },
  {
    icon: Truck,
    title: "Hyperlocal Delivery",
    body: "Same-day delivery by riders who know every village lane and rural terrain.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    body: "UPI, wallet, or cash on delivery — protected transactions on every order.",
  },
  {
    icon: Sparkles,
    title: "Quality Products",
    body: "Batch-tagged sacks with quality seals so you always know what you're feeding your farm.",
  },
  {
    icon: Network,
    title: "Village Network",
    body: "A trust-based supply chain that reinvests in the rural economy it depends on.",
  },
];

const timelineSteps = [
  { icon: MousePointerClick, title: "Choose Product", body: "Browse verified feed, seeds, and produce from sellers around you." },
  { icon: ShoppingBag, title: "Place Order", body: "Confirm cart and pay via UPI, wallet, or cash on delivery." },
  { icon: CheckCircle2, title: "Seller Accepts", body: "The local shop or farmer confirms and prepares your order." },
  { icon: Bike, title: "Delivery Partner Assigned", body: "A trusted rural rider picks up and heads to your gate." },
  { icon: Home, title: "Delivered to Your Doorstep", body: "Fresh, sealed, and on time — signed off at your farm." },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteNav />

      {/* ================== HERO ================== */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden bg-brand">
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=2400&auto=format&fit=crop&q=85"
          alt="Cattle grazing in a rural field at sunset"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
          {/* Left */}
          <div className="max-w-3xl animate-fade-in">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-brand-accent" />
              India's rural commerce bridge · Live in 20+ villages
            </span>
            <h1 className="mb-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Connecting Villages Through{" "}
              <span className="bg-gradient-to-r from-white to-brand-accent bg-clip-text text-transparent">
                Agriculture.
              </span>
            </h1>
            <p className="mb-8 max-w-[54ch] text-pretty text-base text-white/90 sm:text-lg">
              Buy animal feed, seeds, fertilizers, farm produce and farming essentials directly
              from trusted local farmers and village shops.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/marketplace"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground shadow-[0_10px_30px_-10px_rgba(26,77,46,0.55)] ring-1 ring-brand transition-all hover:bg-brand-light hover:shadow-[0_15px_40px_-10px_rgba(26,77,46,0.65)]"
              >
                Explore Marketplace
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-black/20 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
              >
                Become a Seller
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs">
              <TrustPoint>Trusted by 500+ farmers</TrustPoint>
              <TrustPoint>Same-day village delivery</TrustPoint>
              <TrustPoint>Secure UPI & COD</TrustPoint>
            </div>
          </div>

        </div>
      </section>

      {/* ================== STATS ================== */}
      <section className="border-y border-black/5 bg-surface py-14 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group rounded-2xl bg-gradient-to-br from-accent/50 to-surface p-5 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-brand/25 dark:from-white/[0.03] dark:to-transparent dark:ring-white/10"
              >
                <div className="mb-3 grid size-10 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <s.icon className="size-5" strokeWidth={1.75} />
                </div>
                <div className="text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-medium text-ink-muted sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================== FEATURED CATEGORIES ================== */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Categories"
            title="Everything a rural household needs"
            subtitle="Seven curated shelves — sourced from local shops, cooperatives, and farmers."
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featuredCategories.slice(0, 4).map((c) => (
              <CategoryCard key={c.id} c={c} large />
            ))}
            {featuredCategories.slice(4).map((c) => (
              <CategoryCard key={c.id} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ================== WHY ================== */}
      <section className="bg-gradient-to-b from-accent/30 via-surface to-surface py-24 dark:from-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Why GramSetu"
            title="Built on rural trust, powered by technology"
            subtitle="Six commitments we make to every farmer, shop, rider, and household on the platform."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((w) => (
              <div
                key={w.title}
                className="group relative overflow-hidden rounded-2xl bg-surface p-7 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(26,77,46,0.25)] hover:ring-brand/25 dark:bg-card dark:ring-white/10"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-accent transition-transform duration-500 group-hover:scale-x-100" />
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

      {/* ================== HOW IT WORKS TIMELINE ================== */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="How it works"
            title="A transparent journey — click to doorstep"
            subtitle="Every order flows through five checkpoints. You see the story at each step."
          />

          <div className="relative mx-auto max-w-3xl">
            {/* vertical line */}
            <span className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-brand via-brand/30 to-transparent md:left-1/2 md:-translate-x-1/2" />

            <ol className="flex flex-col gap-10">
              {timelineSteps.map((s, i) => (
                <li
                  key={s.title}
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center md:gap-8 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* dot */}
                  <span className="absolute left-6 top-6 z-10 grid size-3 -translate-x-1/2 place-items-center rounded-full bg-brand ring-4 ring-surface md:left-1/2">
                    <span className="size-1.5 rounded-full bg-brand-foreground" />
                  </span>

                  <div className="ml-14 md:ml-0 md:w-1/2">
                    <div className="rounded-2xl bg-surface p-6 ring-1 ring-black/5 transition-shadow hover:shadow-lg dark:bg-card dark:ring-white/10">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
                          <s.icon className="size-5" strokeWidth={1.75} />
                        </div>
                        <span className="tabular-nums text-xs font-semibold uppercase tracking-wider text-brand">
                          Step 0{i + 1}
                        </span>
                      </div>
                      <h4 className="mb-1 text-base font-semibold text-ink">{s.title}</h4>
                      <p className="text-sm leading-relaxed text-ink-muted">{s.body}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
/* ---------- helpers ---------- */

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
      <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-brand">
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-pretty text-base text-ink-muted">{subtitle}</p>}
    </div>
  );
}

function TrustPoint({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-white/90">
      <span className="grid size-4 place-items-center rounded-full bg-white/20 text-white">
        <CheckCircle2 className="size-3" strokeWidth={2.5} />
      </span>
      {children}
    </span>
  );
}

function CategoryCard({
  c,
  large = false,
}: {
  c: {
    id: string;
    name: string;
    tag: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    image: string;
    tint: string;
  };
  large?: boolean;
}) {
  return (
    <Link
      to="/marketplace"
      hash="featured"
      className={`group relative overflow-hidden rounded-2xl bg-surface ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-[0_25px_50px_-25px_rgba(26,77,46,0.4)] hover:ring-brand/30 dark:bg-card dark:ring-white/10 ${
        large ? "aspect-[4/5]" : "aspect-[4/3]"
      }`}
    >
      <img
        src={c.image}
        alt={c.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${c.tint}`} />

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/75">{c.tag}</p>
          <p className="mt-0.5 text-lg font-semibold text-white">{c.name}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-white/90 text-brand shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
          <c.icon className="size-5" strokeWidth={1.75} />
        </div>
      </div>
    </Link>
  );
}

