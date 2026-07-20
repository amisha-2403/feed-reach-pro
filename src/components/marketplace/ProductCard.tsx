import { Star, Heart, Eye, ShoppingCart, MapPin, Truck, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/marketplace-data";
import { CATEGORY_LOOKUP } from "@/lib/marketplace-data";
import { cartStore } from "@/lib/cart-store";

interface ProductCardProps {
  product: Product;
  onQuickView?: (p: Product) => void;
  onToggleWishlist?: (p: Product) => void;
  wishlisted?: boolean;
}

const DELIVERY_LABEL: Record<Product["deliverySpeed"], string> = {
  "same-day": "Same-day delivery",
  "next-day": "Next-day delivery",
  "2-3-days": "In 2–3 days",
};

export function ProductCard({
  product,
  onQuickView,
  onToggleWishlist,
  wishlisted,
}: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const stockConfig = {
    "in-stock": { label: "In Stock", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    "low-stock": { label: "Low Stock", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
    "out-of-stock": { label: "Out of Stock", cls: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
  }[product.stock];
  const category = CATEGORY_LOOKUP[product.category]?.name ?? product.category;
  const outOfStock = product.stock === "out-of-stock";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(26,77,46,0.25)] hover:ring-brand/25 dark:bg-card dark:ring-white/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-white/5">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-brand-accent px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand-accent-foreground shadow-sm">
              {discount}% OFF
            </span>
          )}
          {product.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-2 py-0.5 text-[10px] font-semibold text-brand shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-card/90 dark:ring-white/10">
              <ShieldCheck className="size-3" strokeWidth={2.25} /> Verified
            </span>
          )}
        </div>
        <span
          className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${stockConfig.cls}`}
        >
          {stockConfig.label}
        </span>
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <IconChip
            label="Wishlist"
            active={wishlisted}
            onClick={() => onToggleWishlist?.(product)}
          >
            <Heart className={`size-4 ${wishlisted ? "fill-brand-accent text-brand-accent" : ""}`} />
          </IconChip>
          <IconChip label="Quick view" onClick={() => onQuickView?.(product)}>
            <Eye className="size-4" />
          </IconChip>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand/80">
            {category}
          </span>
          <div className="flex items-center gap-1 rounded-md bg-brand/8 px-1.5 py-0.5 text-xs font-medium text-brand">
            <Star className="size-3 fill-brand" strokeWidth={0} />
            {product.rating}
            <span className="text-ink-muted">({product.reviews})</span>
          </div>
        </div>

        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
            {product.name}
          </h3>
          {product.brand && (
            <p className="mt-1 text-[11px] text-ink-muted">by {product.brand}</p>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-ink">₹{product.price}</span>
          <span className="text-xs text-ink-muted line-through">₹{product.originalPrice}</span>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-black/5 pt-3 dark:border-white/10">
          <div className="flex min-w-0 items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium text-ink/85">{product.seller}</span>
            <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
              {product.sellerType}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {product.village}, {product.district}
            </span>
            {product.deliveryAvailable && (
              <span className="inline-flex items-center gap-1 text-brand">
                <Truck className="size-3" /> {DELIVERY_LABEL[product.deliverySpeed]}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <button
            disabled={outOfStock}
            onClick={() => !outOfStock && cartStore.add(product.id)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-medium text-brand-foreground shadow-sm transition-all hover:bg-brand-light hover:shadow-md disabled:cursor-not-allowed disabled:bg-ink-muted/40 disabled:text-white"
          >
            <ShoppingCart className="size-4" />
            {outOfStock ? "Notify Me" : "Add to Cart"}
          </button>
          <Link
            to="/marketplace/$productId"
            params={{ productId: product.id }}
            className="grid place-items-center rounded-full border border-black/10 px-3 text-xs font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand dark:border-white/15 dark:text-foreground"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function IconChip({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`grid size-9 place-items-center rounded-full shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-transform hover:scale-110 dark:ring-white/10 ${
        active
          ? "bg-brand-accent/15 text-brand-accent"
          : "bg-surface/95 text-ink hover:text-brand dark:bg-card/95 dark:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
