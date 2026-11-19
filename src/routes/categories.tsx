import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Search, X } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { CATEGORIES, type Category } from "@/lib/marketplace-data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Shop Categories — GramSetu" },
      {
        name: "description",
        content:
          "Browse farm supplies, seeds, animal feed, produce, and more from GramSetu’s local marketplace.",
      },
    ],
  }),
  component: CategoriesPage,
});

type Subcategory = { name: string; query: string };

const descriptions: Record<string, string> = {
  "animal-feed": "Everyday feed and nutrition for cattle and poultry.",
  seeds: "Crop and vegetable seeds from local marketplace sellers.",
  fertilizers: "Soil nutrition options for a healthy growing season.",
  "farm-produce": "Fresh produce listed by farmers and village shops.",
  organic: "Organic goods and natural crop-care products.",
  veterinary: "Animal health and first-aid essentials.",
  essentials: "Useful tools and equipment for day-to-day farm work.",
};

// These browse terms map to product names already present in the marketplace catalogue.
const subcategories: Record<string, Subcategory[]> = {
  "animal-feed": [
    { name: "Cattle Feed", query: "cattle" },
    { name: "Poultry Feed", query: "poultry" },
  ],
  seeds: [
    { name: "Cereal Seeds", query: "wheat" },
    { name: "Vegetable Seeds", query: "tomato" },
  ],
  fertilizers: [
    { name: "Organic Fertilizers", query: "vermicompost" },
    { name: "Mineral Fertilizers", query: "urea" },
  ],
  "farm-produce": [
    { name: "Tomatoes", query: "tomatoes" },
    { name: "Onions", query: "onions" },
  ],
  organic: [
    { name: "Dairy Products", query: "ghee" },
    { name: "Natural Crop Care", query: "neem" },
  ],
  essentials: [{ name: "Sprayers", query: "sprayer" }],
};

const popularCategoryIds = ["animal-feed", "seeds", "fertilizers", "farm-produce"];

function CategoriesPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const matchingCategories = normalizedQuery
    ? CATEGORIES.filter((category) => {
        const categoryMatches = `${category.name} ${descriptions[category.id] ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);
        const subcategoryMatches = (subcategories[category.id] ?? []).some((item) =>
          item.name.toLowerCase().includes(normalizedQuery),
        );
        return categoryMatches || subcategoryMatches;
      })
    : [];

  const popularCategories = popularCategoryIds
    .map((id) => CATEGORIES.find((category) => category.id === id))
    .filter((category): category is Category => Boolean(category));
  const remainingCategories = CATEGORIES.filter(
    (category) => !popularCategoryIds.includes(category.id),
  );

  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteNav />

      <main>
        <section className="border-b border-black/5 bg-gradient-to-b from-accent/40 to-surface dark:border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Browse the marketplace
            </p>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Find what your farm needs
                </h1>
                <p className="mt-3 max-w-2xl text-pretty text-base text-ink-muted">
                  Explore products from local farmers and village shops, organized by category.
                </p>
              </div>

              <label className="relative block w-full md:max-w-md">
                <span className="sr-only">Search categories and subcategories</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search seeds, cattle feed, tools…"
                  className="h-12 w-full rounded-full border border-black/10 bg-surface pl-11 pr-12 text-sm text-ink shadow-sm outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-card dark:text-foreground"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear category search"
                    className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition hover:bg-accent hover:text-ink dark:hover:bg-white/10 dark:hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </label>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-12 px-6 py-10 sm:py-14">
          {normalizedQuery ? (
            <section aria-live="polite">
              <SectionHeading
                eyebrow="Search results"
                title={`Categories matching “${query.trim()}”`}
              />
              {matchingCategories.length ? (
                <CategoryGrid
                  categories={matchingCategories.map((match) => match.category)}
                  searchQuery={normalizedQuery}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-brand/25 bg-brand/[0.03] px-6 py-12 text-center dark:bg-white/[0.02]">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand/10 text-brand">
                    <Search className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-ink">No categories found</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Try a category such as seeds, animal feed, or fertilizers.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-5 inline-flex items-center gap-1 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-light"
                  >
                    Browse all categories <ArrowRight className="size-4" />
                  </button>
                </div>
              )}
            </section>
          ) : (
            <>
              <section>
                <SectionHeading
                  eyebrow="A good place to start"
                  title="Popular Categories"
                  subtitle="A few key sections from the GramSetu catalogue."
                />
                <CategoryGrid categories={popularCategories} />
              </section>

              <section>
                <SectionHeading
                  eyebrow="Browse everything"
                  title="All Categories"
                  subtitle="Explore the full range of categories available in the marketplace."
                />
                <CategoryGrid categories={remainingCategories} />
              </section>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function CategoryGrid({
  categories,
  searchQuery,
}: {
  categories: Category[];
  searchQuery?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const availableSubcategories = subcategories[category.id] ?? [];
        const visibleSubcategories = searchQuery
          ? availableSubcategories.filter((item) => item.name.toLowerCase().includes(searchQuery))
          : availableSubcategories;

        return (
          <div key={category.id} className="flex min-w-0 flex-col">
            <Link
              to="/marketplace"
              search={{ category: category.id }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 hover:ring-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:bg-card dark:ring-white/10"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-accent">
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl bg-white/90 text-brand shadow-sm backdrop-blur-sm">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </span>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                  <h3 className="text-lg font-semibold leading-tight">{category.name}</h3>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 transition group-hover:bg-white/25">
                    <ChevronRight className="size-4" />
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm leading-relaxed text-ink-muted">
                  {descriptions[category.id]}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  Browse category <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {visibleSubcategories.length > 0 && (
              <div className="mt-3 flex min-h-8 flex-wrap gap-2" aria-label={`${category.name} subcategories`}>
                {visibleSubcategories.map((subcategory) => (
                  <Link
                    key={subcategory.name}
                    to="/marketplace"
                    search={{ category: category.id, query: subcategory.query }}
                    className="inline-flex min-h-8 items-center rounded-full border border-brand/15 bg-brand/[0.04] px-3 py-1 text-xs font-medium text-brand transition hover:border-brand/30 hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:bg-white/[0.03]"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
    <div className="mb-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
