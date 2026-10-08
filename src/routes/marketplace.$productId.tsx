import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Lock,
  Undo2,
  Star,
  MapPin,
  Store,
  Sprout,
  Users,
  Phone,
  MessageCircle,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  CheckCircle2,
  Package,
  Leaf,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  PRODUCTS,
  SELLERS,
  CATEGORY_LOOKUP,
  type Product,
} from "@/lib/marketplace-data";

export const Route = createFileRoute("/marketplace/$productId")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p)
      return {
        meta: [
          { title: "Product not found — GramSetu" },
          { name: "robots", content: "noindex" },
        ],
      };
    return {
      meta: [
        { title: `${p.name} — GramSetu Marketplace` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — GramSetu` },
        { property: "og:description", content: p.description },
        { property: "og:image", content: p.image },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.image },
      ],
    };
  },
  component: ProductDetailsPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold text-ink">Product not found</h1>
        <p className="mt-3 text-ink-muted">
          The item you're looking for may have been sold out or removed.
        </p>
        <Link
          to="/marketplace"
          className="mt-6 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground"
        >
          Browse marketplace
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

const UNITS = ["50kg Bag", "25kg Bag", "10kg Pack", "1kg Packet"];
const ADDRESSES = [
  { id: "a1", label: "Home", line: "Plot 12, Green Lane, Rampur, UP — 244901" },
  { id: "a2", label: "Farm", line: "Sector 7, Village Road, Sinnar, Nashik — 422103" },
];

function ProductDetailsPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const seller = SELLERS.find((s) => s.id === product.sellerId);
  const category = CATEGORY_LOOKUP[product.category];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(UNITS[0]);
  const [address, setAddress] = useState(ADDRESSES[0].id);
  const [wishlisted, setWishlisted] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"newest" | "oldest" | "rating">("newest");

  const gallery = product.gallery.length ? product.gallery : [product.image];
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const stockConfig = {
    "in-stock": { label: "In Stock", cls: "text-emerald-700 bg-emerald-500/10" },
    "low-stock": { label: "Only a few left", cls: "text-amber-700 bg-amber-500/15" },
    "out-of-stock": { label: "Out of Stock", cls: "text-rose-700 bg-rose-500/10" },
  }[product.stock];
  const outOfStock = product.stock === "out-of-stock";
  const purchased = 400 + product.reviews * 3;

  const related = useMemo(() => {
    const same = PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id,
    );
    const seller = PRODUCTS.filter(
      (p) => p.sellerId === product.sellerId && p.id !== product.id,
    );
    const others = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 8);
    return {
      alsoBought: same.slice(0, 4),
      similar: [...same, ...others].slice(0, 4),
      fromSeller: seller.slice(0, 4),
      recentlyViewed: others.slice(2, 6),
    };
  }, [product]);

  const reviews = useMemo(() => buildReviews(product), [product]);
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (reviewFilter === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (reviewFilter === "oldest") sorted.reverse();
    return sorted;
  }, [reviews, reviewFilter]);

  const ratingBreakdown = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: Math.max(
        1,
        Math.round(
          product.reviews *
            (star === 5 ? 0.62 : star === 4 ? 0.24 : star === 3 ? 0.08 : star === 2 ? 0.04 : 0.02),
        ),
      ),
    }));
    return buckets;
  }, [product.reviews]);

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos({ x, y });
  };

  return (
    <div className="min-h-screen bg-surface pb-24 text-ink lg:pb-0">
      <SiteNav />

      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 pt-6 sm:px-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
          <li>
            <Link to="/" className="hover:text-brand">Home</Link>
          </li>
          <ChevronRight className="size-3" />
          <li>
            <Link to="/marketplace" className="hover:text-brand">Marketplace</Link>
          </li>
          <ChevronRight className="size-3" />
          <li className="text-brand">{category?.name ?? product.category}</li>
          <ChevronRight className="size-3" />
          <li className="truncate max-w-[50vw] font-medium text-ink">{product.name}</li>
        </ol>
      </nav>

      {/* Main grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]">
          {/* Gallery */}
          <div className="lg:col-span-1">
            <div
              className="group relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
              onMouseMove={handleHover}
              onMouseLeave={() => setHoverPos(null)}
            >
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover"
                style={
                  hoverPos
                    ? {
                        transform: `scale(1.7)`,
                        transformOrigin: `${hoverPos.x}% ${hoverPos.y}%`,
                        transition: "transform 0.05s",
                      }
                    : undefined
                }
              />
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-brand-accent-foreground shadow-md">
                  {discount}% OFF
                </span>
              )}
              <button
                onClick={() => setZoom(true)}
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-medium text-ink shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:bg-card/95 dark:ring-white/10"
              >
                <ZoomIn className="size-3.5" /> View full
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`size-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                    i === activeImg
                      ? "ring-brand"
                      : "ring-transparent hover:ring-brand/30"
                  }`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { icon: BadgeCheck, label: "Verified Seller" },
                { icon: ShieldCheck, label: "Quality Checked" },
                { icon: Lock, label: "Secure Payment" },
                { icon: Truck, label: "Fast Delivery" },
                { icon: Undo2, label: "Easy Returns" },
                { icon: Leaf, label: "Farm Sourced" },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-2 rounded-xl bg-accent/50 p-2.5 dark:bg-white/5"
                >
                  <t.icon className="size-4 shrink-0 text-brand" />
                  <span className="text-[11px] font-medium text-ink">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 lg:col-span-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
                {category?.name ?? product.category}
              </span>
              {product.brand && (
                <span className="rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] font-medium text-ink-muted dark:border-white/10">
                  {product.brand}
                </span>
              )}
              {product.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <ShieldCheck className="size-3" /> Verified Seller
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-medium text-brand">
                <Star className="size-3.5 fill-brand" strokeWidth={0} />
                {product.rating}
                <span className="text-ink-muted">({product.reviews} reviews)</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-ink-muted">
                <ThumbsUp className="size-3.5" /> {purchased.toLocaleString()} people purchased
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/85">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3 border-y border-black/5 py-4 dark:border-white/10">
              <span className="text-4xl font-semibold tracking-tight text-ink">
                ₹{product.price}
              </span>
              <span className="text-base text-ink-muted line-through">
                ₹{product.originalPrice}
              </span>
              {discount > 0 && (
                <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-xs font-semibold text-brand-accent">
                  Save ₹{product.originalPrice - product.price} ({discount}%)
                </span>
              )}
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${stockConfig.cls}`}
              >
                {stockConfig.label}
              </span>
            </div>

            {/* Unit variants */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Select unit
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {UNITS.map((u) => (
                  <button
                    key={u}
                    onClick={() => setVariant(u)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                      variant === u
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-black/10 text-ink hover:border-brand/40 dark:border-white/15"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Deliver to
              </p>
              <div className="mt-2 space-y-2">
                {ADDRESSES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAddress(a.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      address === a.id
                        ? "border-brand bg-brand/5"
                        : "border-black/10 hover:border-brand/40 dark:border-white/15"
                    }`}
                  >
                    <div
                      className={`mt-0.5 size-4 shrink-0 rounded-full border-2 ${
                        address === a.id ? "border-brand bg-brand" : "border-ink-muted"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{a.label}</p>
                      <p className="truncate text-xs text-ink-muted">{a.line}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700">
                <Truck className="size-3.5" /> Estimated delivery: Tomorrow, before 6 PM
              </p>
            </div>
          </div>

          {/* Sticky purchase card (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4 rounded-3xl bg-surface p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Your order
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-ink">
                    ₹{product.price * qty}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs font-semibold text-emerald-700">
                      Saved ₹{(product.originalPrice - product.price) * qty}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  Incl. of all taxes · Free delivery over ₹499
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-black/10 p-2 dark:border-white/15">
                <span className="pl-2 text-xs font-medium text-ink-muted">Qty</span>
                <div className="inline-flex items-center">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid size-8 place-items-center rounded-lg hover:bg-accent"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="grid size-8 place-items-center rounded-lg hover:bg-accent"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <button
                disabled={outOfStock}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-all hover:bg-brand-light hover:shadow-md disabled:cursor-not-allowed disabled:bg-ink-muted/40"
              >
                <ShoppingCart className="size-4" />
                {outOfStock ? "Notify Me" : "Add to Cart"}
              </button>
              <button
                disabled={outOfStock}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent py-3 text-sm font-semibold text-brand-accent-foreground shadow-sm transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:bg-ink-muted/40"
              >
                <Zap className="size-4" /> Buy Now
              </button>

              <div className="flex items-center justify-center gap-4 border-t border-black/5 pt-3 text-xs text-ink-muted dark:border-white/10">
                <button
                  onClick={() => setWishlisted((w) => !w)}
                  className="inline-flex items-center gap-1.5 hover:text-brand-accent"
                >
                  <Heart
                    className={`size-3.5 ${wishlisted ? "fill-brand-accent text-brand-accent" : ""}`}
                  />
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>
                <span className="text-black/10 dark:text-white/10">|</span>
                <button className="inline-flex items-center gap-1.5 hover:text-brand">
                  <Share2 className="size-3.5" /> Share
                </button>
              </div>

              <div className="rounded-xl bg-accent/60 p-3 dark:bg-white/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand">
                  <Package className="size-3.5" /> Ships in {variant}
                </div>
                <p className="mt-1 text-[11px] text-ink-muted">
                  From {product.village}, {product.district}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Description sections */}
      <section className="bg-accent/30 py-14 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-ink">Product details</h2>
            <div className="mt-6 space-y-6">
              {[
                {
                  title: "Overview",
                  icon: Package,
                  body: product.description,
                },
                {
                  title: "Benefits",
                  icon: CheckCircle2,
                  bullets: [
                    "Boosts productivity and yield with balanced nutrition",
                    "Sourced directly from verified farms and cooperatives",
                    "Cost-effective bulk packaging for households and farms",
                    "Backed by GramSetu quality assurance",
                  ],
                },
                {
                  title: "Recommended Usage",
                  icon: Sprout,
                  body:
                    "Follow the manufacturer's dosage guidelines. For best results, use within the recommended season and store in a cool, dry place away from direct sunlight.",
                },
                {
                  title: "Suitable For",
                  icon: Leaf,
                  bullets: [
                    "Small and marginal farmers",
                    "Dairy owners and livestock keepers",
                    "Village kirana shops and cooperatives",
                  ],
                },
                {
                  title: "Storage Instructions",
                  icon: Clock,
                  body:
                    "Keep in a dry, ventilated area. Reseal packaging after use. Avoid moisture, direct sunlight and storage near chemicals or pesticides.",
                },
                {
                  title: "Safety Instructions",
                  icon: ShieldCheck,
                  body:
                    "Keep out of reach of children. Wash hands after handling. In case of accidental contact with eyes, rinse with clean water and consult a physician.",
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl bg-surface p-5 ring-1 ring-black/5 dark:bg-card dark:ring-white/10"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">
                      <s.icon className="size-4" />
                    </span>
                    <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                  </div>
                  {s.body && (
                    <p className="mt-3 text-sm leading-relaxed text-ink/85">{s.body}</p>
                  )}
                  {s.bullets && (
                    <ul className="mt-3 space-y-1.5 text-sm text-ink/85">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications table */}
          <div>
            <h2 className="text-2xl font-semibold text-ink">Specifications</h2>
            <div className="mt-6 overflow-hidden rounded-2xl bg-surface ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {[
                    ...product.specs,
                    { label: "Brand", value: product.brand ?? "GramSetu" },
                    { label: "Manufactured By", value: product.seller },
                    { label: "Package Type", value: variant },
                    { label: "Expiry", value: "12 months from manufacture" },
                    {
                      label: "Category",
                      value: category?.name ?? product.category,
                    },
                    {
                      label: "Organic",
                      value: product.category === "organic" ? "Yes" : "No",
                    },
                  ].map((s) => (
                    <tr key={s.label}>
                      <td className="w-1/2 bg-accent/40 px-4 py-3 text-xs font-medium text-ink-muted dark:bg-white/5">
                        {s.label}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-ink">
                        {s.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Seller card */}
      {seller && <SellerBigCard seller={seller} />}

      {/* Reviews */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-brand">
                Ratings & Reviews
              </span>
              <h2 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
                What villagers are saying
              </h2>
            </div>
            <div className="inline-flex rounded-full border border-black/10 p-1 dark:border-white/15">
              {(["newest", "oldest", "rating"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setReviewFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    reviewFilter === f
                      ? "bg-brand text-brand-foreground"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {f === "rating" ? "Top rated" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="rounded-2xl bg-accent/40 p-6 dark:bg-white/5">
              <div className="text-center">
                <div className="text-5xl font-semibold text-ink">{product.rating}</div>
                <div className="mt-1 inline-flex text-brand-accent">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i <= Math.round(product.rating) ? "fill-brand-accent" : ""
                      }`}
                      strokeWidth={i <= Math.round(product.rating) ? 0 : 1.5}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  Based on {product.reviews} reviews
                </p>
              </div>
              <div className="mt-6 space-y-2">
                {ratingBreakdown.map((r) => {
                  const pct = Math.round((r.count / product.reviews) * 100);
                  return (
                    <div key={r.star} className="flex items-center gap-3 text-xs">
                      <span className="w-6 text-ink-muted">{r.star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-ink-muted">{r.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {sortedReviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl bg-surface p-5 ring-1 ring-black/5 dark:bg-card dark:ring-white/10"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={r.avatar}
                      alt=""
                      className="size-11 rounded-full object-cover ring-2 ring-brand/20"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">{r.name}</span>
                        {r.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <BadgeCheck className="size-3" /> Verified Purchase
                          </span>
                        )}
                        <span className="ml-auto text-[11px] text-ink-muted">{r.date}</span>
                      </div>
                      <div className="mt-1 inline-flex text-brand-accent">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`size-3 ${i <= r.rating ? "fill-brand-accent" : ""}`}
                            strokeWidth={i <= r.rating ? 0 : 1.5}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-ink/90">{r.body}</p>
                      {r.images.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {r.images.map((img) => (
                            <img
                              key={img}
                              src={img}
                              alt=""
                              className="size-16 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related sections */}
      <RelatedRow title="Customers also bought" products={related.alsoBought} />
      <RelatedRow title="Similar products" products={related.similar} muted />
      {related.fromSeller.length > 0 && (
        <RelatedRow
          title={`More from ${product.seller}`}
          products={related.fromSeller}
        />
      )}
      <RelatedRow
        title="Recently viewed"
        products={related.recentlyViewed}
        muted
      />

      <SiteFooter />

      {/* Sticky mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-[auto_1fr_1fr] items-center gap-2 border-t border-black/5 bg-surface/95 p-3 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-background/95">
        <div className="pl-1">
          <p className="text-sm font-semibold text-ink">₹{product.price}</p>
          <p className="text-[10px] text-ink-muted line-through">₹{product.originalPrice}</p>
        </div>
        <button
          disabled={outOfStock}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand py-2.5 text-xs font-semibold text-brand disabled:opacity-50"
        >
          <ShoppingCart className="size-4" /> Cart
        </button>
        <button
          disabled={outOfStock}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent py-2.5 text-xs font-semibold text-brand-accent-foreground disabled:opacity-50"
        >
          <Zap className="size-4" /> Buy Now
        </button>
      </div>

      {/* Fullscreen zoom */}
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-5xl border-0 bg-black/95 p-0">
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <div className="relative flex h-[85vh] items-center justify-center">
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={() =>
                setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)
              }
              className="absolute left-4 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
              className="absolute right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRightIcon className="size-5" />
            </button>
            <button
              onClick={() => setZoom(false)}
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SellerBigCard({ seller }: { seller: (typeof SELLERS)[number] }) {
  const TypeIcon =
    seller.type === "Shop" ? Store : seller.type === "Farmer" ? Sprout : Users;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand/5 via-surface to-brand-accent/5 ring-1 ring-black/5 dark:ring-white/10">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="size-20 rounded-2xl object-cover ring-4 ring-surface md:size-24 dark:ring-card"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-ink">{seller.name}</h3>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <ShieldCheck className="size-3" /> Verified
                </span>
              )}
            </div>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-muted">
              <TypeIcon className="size-3" /> {seller.type} · Since {seller.since}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-muted">
              <MapPin className="size-3" /> {seller.village}, {seller.district}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-muted">
              <span>
                <span className="text-lg font-semibold text-ink">
                  {2026 - Number(seller.since)}
                </span>{" "}
                yrs experience
              </span>
              <span>
                <span className="text-lg font-semibold text-ink">
                  {seller.productsListed}
                </span>{" "}
                products
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-brand text-brand" strokeWidth={0} />
                <span className="text-lg font-semibold text-ink">{seller.rating}</span> rating
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm hover:bg-brand-light">
              <Store className="size-4" /> Visit Store
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5">
              <MessageCircle className="size-4" /> Contact
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-3 py-2.5 text-sm text-ink dark:border-white/15">
              <Phone className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedRow({
  title,
  products,
  muted,
}: {
  title: string;
  products: Product[];
  muted?: boolean;
}) {
  if (!products.length) return null;
  return (
    <section className={`py-12 ${muted ? "bg-accent/30 dark:bg-white/[0.02]" : "bg-surface"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
  images: string[];
}

function buildReviews(product: Product): Review[] {
  const base: Review[] = [
    {
      id: "r1",
      name: "Anita Deshmukh",
      avatar: "https://i.pravatar.cc/120?img=47",
      rating: 5,
      date: "12 Jun 2026",
      body: `Excellent quality ${product.name.toLowerCase()}. Delivered to my village on the same day and packaging was proper. Will definitely reorder next month.`,
      verified: true,
      images: [product.gallery[0], product.gallery[1] ?? product.image],
    },
    {
      id: "r2",
      name: "Ravi Kumar",
      avatar: "https://i.pravatar.cc/120?img=12",
      rating: 4,
      date: "2 Jun 2026",
      body: "Good value for money. Seller was responsive and delivery partner was polite. Slightly late but overall a good experience.",
      verified: true,
      images: [],
    },
    {
      id: "r3",
      name: "Meena Sharma",
      avatar: "https://i.pravatar.cc/120?img=45",
      rating: 5,
      date: "24 May 2026",
      body: `Trusted brand and fair pricing. Much better than buying from the town market. Saved almost ₹${Math.round(product.originalPrice - product.price)} on this order.`,
      verified: true,
      images: [product.image],
    },
    {
      id: "r4",
      name: "Ganesh Pawar",
      avatar: "https://i.pravatar.cc/120?img=33",
      rating: 4,
      date: "10 May 2026",
      body: "Product is as described. Would like more variety in units. Otherwise very happy with GramSetu.",
      verified: false,
      images: [],
    },
  ];
  return base;
}
