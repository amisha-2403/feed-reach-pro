import { Star, Heart, Eye, ShoppingCart, MapPin, Truck } from "lucide-react";
import type { Product } from "@/lib/marketplace-data";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const stock = product.stock ?? "in-stock";
  const stockConfig = {
    "in-stock": { label: "In Stock", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    "low-stock": { label: "Low Stock", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
    "out-of-stock": { label: "Out of Stock", cls: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
  }[stock];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(26,77,46,0.25)] hover:ring-brand/25 dark:bg-card dark:ring-white/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-white/5">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand-accent-foreground shadow-sm">
            {discount}% OFF
          </span>
        )}
        <span
          className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${stockConfig.cls}`}
        >
          {stockConfig.label}
        </span>
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <IconChip label="Wishlist">
            <Heart className="size-4" />
          </IconChip>
          <IconChip label="Quick view">
            <Eye className="size-4" />
          </IconChip>
        </div>
      </div>


      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
            {product.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1 rounded-md bg-brand/8 px-1.5 py-0.5 text-xs font-medium text-brand">
            <Star className="size-3 fill-brand" strokeWidth={0} />
            {product.rating}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-ink">₹{product.price}</span>
          <span className="text-xs text-ink-muted line-through">₹{product.originalPrice}</span>
        </div>

        <div className="flex flex-col gap-1 border-t border-black/5 pt-3 dark:border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-ink/85">{product.seller}</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
              {product.sellerType}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {product.village}
            </span>
            {product.deliveryAvailable && (
              <span className="inline-flex items-center gap-1 text-brand">
                <Truck className="size-3" /> Delivery
              </span>
            )}
            <span>({product.reviews})</span>
          </div>
        </div>

        <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-medium text-brand-foreground shadow-sm transition-all hover:bg-brand-light hover:shadow-md">
          <ShoppingCart className="size-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}

function IconChip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid size-9 place-items-center rounded-full bg-surface/95 text-ink shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-transform hover:scale-110 hover:text-brand dark:bg-card/95 dark:text-foreground dark:ring-white/10"
    >
      {children}
    </button>
  );
}
