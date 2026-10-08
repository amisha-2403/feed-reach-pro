import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FiltersSidebar, DEFAULT_FILTERS, type FilterState } from "@/components/marketplace/FiltersSidebar";
import { SellerCard } from "@/components/marketplace/SellerCard";
import { QuickViewModal } from "@/components/marketplace/QuickViewModal";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  CATEGORIES,
  SELLERS,
  type Product,
  type SortId,
} from "@/lib/marketplace-data";
import { fetchProducts, type ProductFilters } from "@/lib/supabase/products";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — GramSetu · Village to Village, Hand to Hand" },
      {
        name: "description",
        content:
          "Shop animal feed, seeds, fertilizers, farm produce, veterinary supplies and organic products from verified farmers and village shops across rural India.",
      },
      { property: "og:title", content: "GramSetu Marketplace — Agri-commerce for Rural India" },
      {
        property: "og:description",
        content:
          "Hyperlocal rural commerce. Buy directly from verified farmers and shops with same-day village delivery.",
      },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");
  const [village, setVillage] = useState("all");
  const [sort, setSort] = useState<SortId>("featured");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  useEffect(() => {
    fetchProducts().then(({ products: fetchedProducts }) => {
      setProducts(fetchedProducts);
      setSupabaseLoaded(true);
    });
  }, []);

  const actualProducts = supabaseLoaded ? products : PRODUCTS;

    const disc = (p: Product) => (p.originalPrice - p.price) / p.originalPrice;
    switch (sort) {
      case "price-asc": out = [...out].sort((a, b) => a.price - b.price); break;
      case "price-desc": out = [...out].sort((a, b) => b.price - a.price); break;
      case "rating": out = [...out].sort((a, b) => b.rating - a.rating); break;
      case "newest": out = [...out].reverse(); break;
      case "discount": out = [...out].sort((a, b) => disc(b) - disc(a)); break;
      default: break;
    }
    return out;
  }, [query, category, district, village, filters, sort]);

  const toggleWishlist = (p: Product) => {
    setWishlist((s) => {
      const next = new Set(s);
      next.has(p.id) ? next.delete(p.id) : next.add(p.id);
      return next;
    });
  };

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    setCategory("all");
    setDistrict("all");
    setVillage("all");
  };

  const bySection = {
    trending: actualProducts.filter((p) => p.tags.includes("trending")),
    bestSellers: actualProducts.filter((p) => p.tags.includes("best-seller")),
    recentlyAdded: actualProducts.filter((p) => p.tags.includes("new")),
    topRated: [...actualProducts].sort((a, b) => b.rating - a.rating).slice(0, 4),
    seasonal: actualProducts.filter((p) => p.tags.includes("seasonal")),
    nearby: actualProducts.filter((p) => ["Nashik", "Pune", "Kolhapur"].includes(p.district)).slice(0, 4),
  };

  return (
    <div className="min-h-screen bg-surface pb-24 text-ink lg:pb-0">
      <SiteNav />
      <MarketplaceHeader
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        district={district}
        onDistrictChange={setDistrict}
        village={village}
        onVillageChange={setVillage}
        sort={sort}
        onSortChange={setSort}
        productCount={filtered.length}
        wishlistCount={wishlist.size}
        cartCount={cart.size}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      {/* Hero strip */}
      <section className="border-b border-black/5 bg-gradient-to-b from-accent/50 to-surface py-10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`group flex flex-col items-center gap-2 rounded-2xl bg-surface p-3 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-brand/25 dark:bg-card dark:ring-white/10 ${
                  category === c.id ? "ring-2 ring-brand" : ""
                }`}
              >
                <div className="relative size-14 overflow-hidden rounded-full">
                  <img src={c.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <span className="text-center text-[11px] font-semibold leading-tight text-ink">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-[168px]">
              <FiltersSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-ink">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
                {district !== "all" && (
                  <span className="ml-2 text-sm font-normal text-ink-muted">
                    in {village !== "all" ? village + ", " : ""}
                    {district}
                  </span>
                )}
              </h2>
            </div>

            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} onBrowseAll={clearAll} />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={setQuickView}
                    onToggleWishlist={toggleWishlist}
                    wishlisted={wishlist.has(p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured sections */}
      <ProductRow title="Trending Products" eyebrow="Trending now" products={bySection.trending} onQuickView={setQuickView} onToggleWishlist={toggleWishlist} wishlist={wishlist} />
      <ProductRow title="Best Sellers" eyebrow="Loved by villages" products={bySection.bestSellers} onQuickView={setQuickView} onToggleWishlist={toggleWishlist} wishlist={wishlist} muted />
      <ProductRow title="Recently Added" eyebrow="Just in" products={bySection.recentlyAdded} onQuickView={setQuickView} onToggleWishlist={toggleWishlist} wishlist={wishlist} />
      <ProductRow title="Top Rated" eyebrow="4.5★ and above" products={bySection.topRated} onQuickView={setQuickView} onToggleWishlist={toggleWishlist} wishlist={wishlist} muted />
      <ProductRow title="Seasonal Recommendations" eyebrow="Right for this season" products={bySection.seasonal} onQuickView={setQuickView} onToggleWishlist={toggleWishlist} wishlist={wishlist} />
      <ProductRow title="Nearby Sellers" eyebrow="Close to you" products={bySection.nearby} onQuickView={setQuickView} onToggleWishlist={toggleWishlist} wishlist={wishlist} muted />

      {/* Featured Sellers */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-brand">Featured sellers</span>
            <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Trusted farmers & village shops</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SELLERS.map((s) => <SellerCard key={s.id} seller={s} />)}
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Mobile filters drawer */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="w-[92vw] max-w-sm overflow-y-auto p-4">
          <SheetHeader className="mb-3">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </SheetContent>
      </Sheet>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-surface/95 p-3 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-background/95">
        <a
          href="/cart"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground shadow-md"
        >
          <ShoppingCart className="size-4" /> View Cart ({cart.size})
        </a>
      </div>

      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onToggleWishlist={toggleWishlist}
        wishlisted={quickView ? wishlist.has(quickView.id) : false}
      />
    </div>
  );
}

function ProductRow({
  title,
  eyebrow,
  products,
  onQuickView,
  onToggleWishlist,
  wishlist,
  muted,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  onQuickView: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Set<string>;
  muted?: boolean;
}) {
  if (!products.length) return null;
  return (
    <section className={`py-14 ${muted ? "bg-accent/30 dark:bg-white/[0.02]" : "bg-surface"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="mb-1 inline-block text-xs font-medium uppercase tracking-wider text-brand">
              {eyebrow}
            </span>
            <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              wishlisted={wishlist.has(p.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
