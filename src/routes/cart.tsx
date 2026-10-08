import { useMemo, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState as useReactState } from "react";
import { computeTotals, getCartLines } from "@/lib/cart-store";
import { loadProductsFromSupabase, getProductById } from "@/hooks/use-cart";
import {
  CartItemRow,
  CartSummary,
  CouponSection,
  EmptyCart,
  RecommendedRow,
  SavedItems,
} from "@/components/cart/CartPieces";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — GramSetu · Village to Village, Hand to Hand" },
      {
        name: "description",
        content:
          "Review your GramSetu cart, apply coupons, choose delivery, and check out securely from verified village sellers.",
      },
      { property: "og:title", content: "Your Cart — GramSetu" },
      {
        property: "og:description",
        content: "Cart, coupons and secure checkout on GramSetu — rural India's agri-commerce marketplace.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const state = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  useEffect(() => {
    loadProductsFromSupabase().then(({ products: fetchedProducts }) => {
      setProducts(fetchedProducts);
      setSupabaseLoaded(true);
    });
  }, []);

  const actualProducts = supabaseLoaded ? products : [];

  const lines = getCartLines(state.items);
  const totals = computeTotals(state);
  const isEmpty = lines.length === 0;

  const rows = useMemo(() => {
    const inCartIds = new Set(state.items.map((i) => i.productId));
    const nearestId = state.items[0]?.productId;
    const nearest = actualProducts.find((p) => p.id === nearestId);
    const nearestProduct = nearest || getProductById(nearestId);

    const fbt = actualProducts.filter((p) =>
      nearestProduct ? p.category === nearestProduct.category && p.id !== nearestProduct.id : false,
    ).slice(0, 4);
    const recommended = actualProducts.filter((p) => p.tags.includes("best-seller") && !inCartIds.has(p.id)).slice(0, 4);
    const recentlyViewed = actualProducts.length > 0 ? [...actualProducts].reverse().slice(0, 4) : [];
    const trending = actualProducts.filter((p) =>
      p.tags.includes("trending") &&
      !inCartIds.has(p.id) &&
      (nearestProduct ? p.district === nearestProduct.district : true),
    ).slice(0, 4);
    return { fbt, recommended, recentlyViewed, trending };
  }, [state.items]);

  return (
    <div className="min-h-screen bg-surface pb-28 text-ink lg:pb-0">
      <SiteNav />

      {/* Page header */}
      <header className="border-b border-black/5 bg-gradient-to-b from-accent/50 to-surface dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-brand"
          >
            <ArrowLeft className="size-3.5" /> Back to Marketplace
          </Link>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Shopping cart</span>
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {isEmpty ? "Your cart is empty" : `${lines.length} ${lines.length === 1 ? "item" : "items"} in your cart`}
              </h1>
              {!isEmpty && (
                <p className="mt-1 text-sm text-ink-muted">
                  From verified farmers & village shops · Delivered hand to hand.
                </p>
              )}
            </div>
            {!isEmpty && (
              <div className="hidden rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold text-brand sm:inline-flex sm:items-center sm:gap-2">
                <ShoppingCart className="size-3.5" />
                Grand total ₹{totals.grandTotal.toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {isEmpty ? (
          <>
            <EmptyCart />
<RecommendedRow
  title="Trending near your village"
  eyebrow="Popular right now"
  products={actualProducts.filter((p) => p.tags.includes("trending"))}
/>
          </>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-3">
                {lines.map(({ product, item }) => (
                  <CartItemRow
                    key={product.id}
                    product={product}
                    qty={item.qty}
                    deliveryType={state.deliveryType}
                  />
                ))}

                <div className="mt-4">
                  <CouponSection state={state} />
                </div>

                <SavedItems state={state} />
              </div>

              <aside className="lg:sticky lg:top-20 lg:self-start">
                <CartSummary state={state} />
              </aside>
            </div>

            <RecommendedRow
              title="Frequently bought together"
              eyebrow="Complete your order"
              products={rows.fbt}
            />
            <RecommendedRow
              title="Recommended for you"
              eyebrow="Handpicked for GramSetu"
              products={rows.recommended}
            />
            <RecommendedRow
              title="Recently viewed"
              eyebrow="Pick up where you left"
              products={rows.recentlyViewed}
            />
            <RecommendedRow
              title="Trending near your village"
              eyebrow="Popular in your area"
              products={rows.trending}
            />
          </>
        )}
      </main>

      <SiteFooter />

      {/* Mobile sticky checkout */}
      {!isEmpty && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-surface/95 p-3 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-background/95">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] text-ink-muted">Grand total</div>
              <div className="text-lg font-semibold text-ink">
                ₹{totals.grandTotal.toLocaleString("en-IN")}
              </div>
            </div>
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground shadow-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
