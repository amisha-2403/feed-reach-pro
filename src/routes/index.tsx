import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sprout, Store, Tractor, Truck } from "lucide-react";

import heroImage from "@/assets/hero-village-supply.jpg";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        property: "og:image",
        content:
          "https://id-preview--bc116421-003f-4204-a56e-17f756c345c9.lovable.app/og-home.jpg",
      },
    ],
  }),
  component: LandingPage,
});

const roles = [
  {
    id: "customer",
    icon: Sprout,
    title: "Customer",
    body: "Order premium feed brands from local neighborhood shops with same-day delivery to your farm.",
  },
  {
    id: "shop",
    icon: Store,
    title: "Shop Owner",
    body: "Manage inventory, receive digital orders, and reach new farmers across the district.",
  },
  {
    id: "farmer",
    icon: Tractor,
    title: "Farmer",
    body: "Supply raw grains and ingredients directly to the local shop network with guaranteed pickup.",
  },
  {
    id: "delivery",
    icon: Truck,
    title: "Delivery Partner",
    body: "Fulfill heavy-load rural orders using tractors, tempos, or bikes on optimized local routes.",
  },
];

const categories = [
  "Cattle Feed",
  "Poultry Feed",
  "Goat Feed",
  "Pet & Bird Feed",
  "Mineral Blocks",
];

const steps = [
  {
    n: "01",
    title: "Select Local Inventory",
    body: "Browse real-time stock from shops within a 15 km radius of your farm or homestead.",
  },
  {
    n: "02",
    title: "Verified Quality Check",
    body: "Every jute sack is tagged with a batch number and quality seal before it leaves the counter.",
  },
  {
    n: "03",
    title: "Hyperlocal Delivery",
    body: "Our delivery partners know rural terrain, ensuring your feed arrives dry, intact, and on time.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteNav />

      {/* Hero */}
      <section className="bg-surface py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-12">
            <div className="max-w-[42ch] animate-fade-in">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-medium tracking-wide text-brand">
                <span className="size-1.5 rounded-full bg-brand" />
                Hyperlocal feed supply, live in your district
              </span>
              <h1 className="mb-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink lg:text-6xl">
                The direct line from farm to trough.
              </h1>
              <p className="mb-8 text-pretty text-base text-ink-muted sm:text-lg">
                FeedConnect links village feed shops, livestock farmers, and delivery partners
                through one dependable platform — so no household is ever short of animal feed.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-brand-foreground shadow-sm ring-1 ring-brand transition-all hover:bg-brand-light hover:shadow-md sm:text-base">
                  Order feed now
                  <ArrowRight className="size-4" />
                </button>
                <button className="rounded-md border border-black/10 bg-white/50 px-6 py-2.5 text-sm font-medium text-ink/80 backdrop-blur-sm transition-colors hover:bg-white sm:text-base dark:border-white/15 dark:bg-white/5 dark:text-foreground/80">
                  Partner with us
                </button>
              </div>
            </div>
            <div className="animate-fade-in overflow-hidden rounded-2xl bg-zinc-100 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_60px_-20px_rgba(0,0,0,0.15)] outline outline-1 -outline-offset-1 outline-black/5 dark:bg-white/5">
              <img
                src={heroImage}
                alt="Jute sacks of animal feed stacked at a village shop counter with cattle in the background"
                width={1920}
                height={832}
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-zinc-50 py-24 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-balance text-center text-2xl font-medium text-ink">
            Built for four sides of the supply chain
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((r) => (
              <article
                key={r.id}
                id={r.id}
                className="group flex flex-col gap-4 rounded-2xl bg-surface p-6 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:ring-brand/30 dark:bg-card dark:ring-white/10"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-brand/8 text-brand transition-colors group-hover:bg-brand/15">
                  <r.icon className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-ink">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{r.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Category strip */}
      <div className="border-y border-black/5 bg-surface py-12 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {categories.map((c) => (
              <span
                key={c}
                className="text-sm font-medium uppercase tracking-wide text-ink/55 dark:text-foreground/50"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start gap-20 lg:flex-row">
            <div className="lg:sticky lg:top-32 lg:w-1/3">
              <h2 className="mb-6 text-balance text-3xl font-semibold leading-tight text-ink">
                Tactile supply from click to counter.
              </h2>
              <p className="text-ink-muted">
                We combine digital efficiency with the traditional trust of village commerce — so
                every sack of feed carries a real story from source to farm.
              </p>
            </div>
            <div className="flex flex-col gap-16 lg:w-2/3">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-8">
                  <span className="tabular-nums text-4xl font-medium text-brand/25">{s.n}</span>
                  <div className="max-w-[52ch]">
                    <h4 className="mb-3 text-lg font-medium text-ink">{s.title}</h4>
                    <p className="text-pretty text-ink-muted">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center rounded-3xl bg-brand p-12 text-center shadow-[0_30px_80px_-30px_rgba(26,77,46,0.5)] lg:p-20">
          <h2 className="mb-8 max-w-[22ch] text-balance text-3xl font-medium leading-tight text-brand-foreground lg:text-4xl">
            Ready to supply your livestock with precision?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-surface px-8 py-3 font-medium text-brand ring-1 ring-surface transition-transform hover:scale-[1.02]">
              Find a local shop
            </button>
            <button className="rounded-full border border-brand-foreground/25 px-8 py-3 font-medium text-brand-foreground/90 transition-colors hover:bg-brand-foreground/10">
              Become a partner
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
