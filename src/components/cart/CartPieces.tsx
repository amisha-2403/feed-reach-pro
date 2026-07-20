import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  Zap,
  Check,
  X,
  ShoppingCart,
} from "lucide-react";
import type { Product } from "@/lib/marketplace-data";
import { CATEGORY_LOOKUP } from "@/lib/marketplace-data";
import {
  cartStore,
  computeTotals,
  estimateDelivery,
  getCartLines,
  COUPONS,
  type CartState,
} from "@/lib/cart-store";

/* ================================================================== */
/*  CartItemRow                                                        */
/* ================================================================== */

export function CartItemRow({
  product,
  qty,
  deliveryType,
}: {
  product: Product;
  qty: number;
  deliveryType: "standard" | "express";
}) {
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const eta = estimateDelivery(product.deliverySpeed, deliveryType);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const outOfStock = product.stock === "out-of-stock";
  const stockCfg = {
    "in-stock": { label: "In stock", cls: "text-emerald-700 dark:text-emerald-400" },
    "low-stock": { label: "Only a few left", cls: "text-amber-700 dark:text-amber-400" },
    "out-of-stock": { label: "Out of stock", cls: "text-rose-700 dark:text-rose-400" },
  }[product.stock];

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setDragX(Math.max(-120, dx));
  };
  const onTouchEnd = () => {
    if (dragX < -80) {
      cartStore.remove(product.id);
    }
    setDragX(0);
    startX.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Swipe-to-remove backdrop (mobile) */}
      <div className="absolute inset-y-0 right-0 flex w-32 items-center justify-center bg-rose-500/90 text-white lg:hidden">
        <div className="flex flex-col items-center gap-1 text-xs font-semibold">
          <Trash2 className="size-5" /> Remove
        </div>
      </div>

      <article
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: `translateX(${dragX}px)` }}
        className="relative flex flex-col gap-4 rounded-2xl bg-surface p-4 ring-1 ring-black/5 transition-transform duration-200 sm:flex-row sm:p-5 dark:bg-card dark:ring-white/10"
      >
        <Link
          to="/marketplace/$productId"
          params={{ productId: product.id }}
          className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:aspect-square sm:w-32 dark:bg-white/5"
        >
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          {discount > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-semibold text-brand-accent-foreground shadow-sm">
              {discount}% OFF
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand/80">
                {CATEGORY_LOOKUP[product.category]?.name ?? product.category}
              </span>
              <Link
                to="/marketplace/$productId"
                params={{ productId: product.id }}
                className="mt-0.5 block truncate text-[15px] font-semibold text-ink hover:text-brand"
              >
                {product.name}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  {product.seller}
                  {product.verified && <ShieldCheck className="size-3 text-brand" />}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" /> {product.village}, {product.district}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-semibold text-ink">
                ₹{(product.price * qty).toLocaleString("en-IN")}
              </div>
              {discount > 0 && (
                <div className="text-[11px] text-ink-muted line-through">
                  ₹{(product.originalPrice * qty).toLocaleString("en-IN")}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
            <span className={`font-semibold ${stockCfg.cls}`}>{stockCfg.label}</span>
            {product.deliveryAvailable && !outOfStock && (
              <span className="inline-flex items-center gap-1 text-brand">
                <Truck className="size-3" /> Delivery by {eta.label}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/15">
              <button
                aria-label="Decrease"
                onClick={() => cartStore.setQty(product.id, qty - 1)}
                className="grid size-9 place-items-center text-ink transition-colors hover:text-brand"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-9 text-center text-sm font-semibold text-ink">{qty}</span>
              <button
                aria-label="Increase"
                onClick={() => cartStore.setQty(product.id, qty + 1)}
                disabled={outOfStock}
                className="grid size-9 place-items-center text-ink transition-colors hover:text-brand disabled:opacity-40"
              >
                <Plus className="size-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => cartStore.saveForLater(product.id)}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-ink-muted transition-colors hover:bg-brand/8 hover:text-brand"
              >
                <Bookmark className="size-3.5" /> Save for later
              </button>
              <button
                onClick={() => cartStore.remove(product.id)}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-ink-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
              >
                <Trash2 className="size-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ================================================================== */
/*  Saved for later                                                    */
/* ================================================================== */

export function SavedItems({ state }: { state: CartState }) {
  const saved = getCartLines(state.saved);
  if (!saved.length) return null;
  return (
    <section className="mt-10 rounded-3xl bg-surface p-5 ring-1 ring-black/5 sm:p-6 dark:bg-card dark:ring-white/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Saved for later</span>
          <h3 className="text-lg font-semibold text-ink">{saved.length} items waiting</h3>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {saved.map(({ product }) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-2xl border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-background/40"
          >
            <Link
              to="/marketplace/$productId"
              params={{ productId: product.id }}
              className="size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5"
            >
              <img src={product.image} alt="" className="h-full w-full object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="line-clamp-2 text-sm font-semibold text-ink">{product.name}</p>
              <p className="mt-0.5 text-[11px] text-ink-muted">{product.seller} · {product.village}</p>
              <div className="mt-1 text-sm font-semibold text-ink">₹{product.price}</div>
              <div className="mt-auto flex gap-2 pt-2 text-xs">
                <button
                  onClick={() => cartStore.moveToCart(product.id)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-brand py-1.5 font-medium text-brand-foreground hover:bg-brand-light"
                >
                  <ShoppingCart className="size-3.5" /> Move to cart
                </button>
                <button
                  onClick={() => cartStore.removeSaved(product.id)}
                  className="grid size-8 place-items-center rounded-full border border-black/10 text-ink-muted hover:border-rose-500/30 hover:text-rose-600 dark:border-white/15"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Coupon                                                              */
/* ================================================================== */

export function CouponSection({ state }: { state: CartState }) {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const apply = (code: string) => {
    const res = cartStore.applyCoupon(code);
    setMsg({ ok: res.ok, text: res.message });
    if (res.ok) setInput("");
  };

  return (
    <section className="rounded-3xl bg-surface ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <Tag className="size-4 text-brand" /> Apply coupon
          {state.couponCode && (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
              {state.couponCode} applied
            </span>
          )}
        </span>
        <ChevronDown className={`size-4 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-black/5 p-5 dark:border-white/10">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 rounded-full border border-black/10 bg-surface px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-brand/50 dark:border-white/15 dark:bg-background/50"
            />
            <button
              onClick={() => apply(input)}
              disabled={!input.trim()}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-40"
            >
              Apply
            </button>
          </div>

          {msg && (
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                msg.ok
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
              }`}
            >
              {msg.ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
              {msg.text}
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            {COUPONS.map((c) => {
              const active = state.couponCode === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => (active ? cartStore.removeCoupon() : apply(c.code))}
                  className={`group flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? "border-brand bg-brand/5"
                      : "border-dashed border-brand/30 hover:border-brand hover:bg-brand/[0.04]"
                  }`}
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-brand">{c.code}</span>
                      {active && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">
                          Applied
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-ink">{c.label}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">{c.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/*  Summary                                                             */
/* ================================================================== */

export function CartSummary({ state }: { state: CartState }) {
  const t = computeTotals(state);
  const savings = t.productDiscount + t.couponDiscount;

  return (
    <div className="space-y-4">
      {/* Delivery type */}
      <div className="rounded-3xl bg-surface p-5 ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-brand">Delivery</span>
        <div className="grid grid-cols-2 gap-2">
          {(["standard", "express"] as const).map((type) => {
            const active = state.deliveryType === type;
            return (
              <button
                key={type}
                onClick={() => cartStore.setDeliveryType(type)}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  active
                    ? "border-brand bg-brand/5"
                    : "border-black/10 hover:border-brand/40 dark:border-white/15"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                  {type === "express" ? <Zap className="size-3.5 text-brand-accent" /> : <Truck className="size-3.5 text-brand" />}
                  {type === "express" ? "Express" : "Standard"}
                </div>
                <p className="mt-1 text-[11px] text-ink-muted">
                  {type === "express" ? "1 day faster · ₹99" : "2–3 days · ₹49"}
                </p>
              </button>
            );
          })}
        </div>
        {!t.freeDeliveryEligible && t.subtotal > 0 && (
          <div className="mt-3 rounded-xl bg-brand/8 p-3 text-xs text-brand">
            Add <strong>₹{t.amountToFreeDelivery}</strong> more for FREE standard delivery.
          </div>
        )}
        {t.freeDeliveryEligible && state.deliveryType === "standard" && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Check className="size-3.5" /> You unlocked FREE delivery
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="rounded-3xl bg-surface p-5 ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
        <h3 className="mb-4 text-base font-semibold text-ink">Order summary</h3>
        <dl className="space-y-2.5 text-sm">
          <Row label="Items total" value={`₹${t.itemsTotal.toLocaleString("en-IN")}`} />
          {t.productDiscount > 0 && (
            <Row
              label="Product discount"
              value={`− ₹${t.productDiscount.toLocaleString("en-IN")}`}
              positive
            />
          )}
          {t.couponDiscount > 0 && (
            <Row
              label={`Coupon (${state.couponCode})`}
              value={`− ₹${t.couponDiscount.toLocaleString("en-IN")}`}
              positive
            />
          )}
          <Row
            label="Delivery"
            value={t.delivery === 0 ? "FREE" : `₹${t.delivery}`}
            positive={t.delivery === 0}
          />
          <Row label="GST (5%)" value={`₹${t.gst.toLocaleString("en-IN")}`} />
        </dl>
        <div className="my-4 border-t border-dashed border-black/10 dark:border-white/15" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-ink">Grand total</span>
          <span className="text-2xl font-semibold text-ink">
            ₹{t.grandTotal.toLocaleString("en-IN")}
          </span>
        </div>
        {savings > 0 && (
          <p className="mt-2 text-xs font-medium text-brand">
            You save ₹{savings.toLocaleString("en-IN")} on this order
          </p>
        )}

        <button
          disabled={t.subtotal === 0}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground shadow-md transition-all hover:bg-brand-light hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
        >
          Proceed to Checkout
        </button>
        <Link
          to="/marketplace"
          className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full border border-black/10 py-2.5 text-sm font-medium text-ink hover:border-brand/40 hover:text-brand dark:border-white/15"
        >
          Continue Shopping
        </Link>
        <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-ink-muted">
          <ShieldCheck className="size-3.5 text-brand" /> Secure checkout · Cash on delivery available
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={`font-medium ${positive ? "text-emerald-700 dark:text-emerald-400" : "text-ink"}`}>
        {value}
      </dd>
    </div>
  );
}

/* ================================================================== */
/*  Recommended row                                                     */
/* ================================================================== */

export function RecommendedRow({
  title,
  eyebrow,
  products,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
}) {
  if (!products.length) return null;
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <span className="mb-0.5 inline-block text-[11px] font-semibold uppercase tracking-wider text-brand">
            {eyebrow}
          </span>
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <RecommendedCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function RecommendedCard({ product }: { product: Product }) {
  const inCart = cartStore.getState().items.some((i) => i.productId === product.id);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-card dark:ring-white/10">
      <Link
        to="/marketplace/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-square overflow-hidden bg-zinc-100 dark:bg-white/5"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 text-xs font-semibold text-ink">{product.name}</p>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-0.5 rounded bg-brand/10 px-1.5 py-0.5 font-medium text-brand">
            <Star className="size-3 fill-brand" strokeWidth={0} />
            {product.rating}
          </span>
          <span className="text-ink-muted">{product.village}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-ink">₹{product.price}</span>
          <button
            onClick={() => cartStore.add(product.id)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              inCart
                ? "bg-brand/10 text-brand"
                : "bg-brand text-brand-foreground hover:bg-brand-light"
            }`}
          >
            <ShoppingCart className="size-3.5" /> {inCart ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ================================================================== */
/*  Empty cart                                                          */
/* ================================================================== */

export function EmptyCart() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="relative mx-auto mb-6 grid size-36 place-items-center">
        <div className="absolute inset-0 rounded-full bg-brand/10 blur-2xl" />
        <div className="relative grid size-32 place-items-center rounded-full bg-surface ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
          <ShoppingBag className="size-14 text-brand" strokeWidth={1.5} />
        </div>
        <span className="absolute -right-1 -top-1 grid size-9 place-items-center rounded-full bg-brand-accent text-brand-accent-foreground shadow-md">
          <Sparkles className="size-4" />
        </span>
      </div>
      <h2 className="text-2xl font-semibold text-ink">Your cart is waiting to be filled</h2>
      <p className="mt-2 text-sm text-ink-muted">
        From village-fresh produce to verified farm supplies — start browsing the GramSetu marketplace.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-md hover:bg-brand-light"
        >
          <ShoppingCart className="size-4" /> Browse Marketplace
        </Link>
        <Link
          to="/marketplace"
          hash="categories"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-ink hover:border-brand/40 hover:text-brand dark:border-white/15"
        >
          View Categories
        </Link>
      </div>
    </div>
  );
}
