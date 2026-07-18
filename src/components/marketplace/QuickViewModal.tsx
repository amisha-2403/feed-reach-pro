import { useState } from "react";
import { Heart, MapPin, Minus, Plus, Share2, ShieldCheck, ShoppingCart, Star, Truck, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/marketplace-data";
import { CATEGORY_LOOKUP } from "@/lib/marketplace-data";

interface Props {
  product: Product | null;
  onClose: () => void;
  onToggleWishlist?: (p: Product) => void;
  wishlisted?: boolean;
}

export function QuickViewModal({ product, onClose, onToggleWishlist, wishlisted }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) return null;
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const category = CATEGORY_LOOKUP[product.category]?.name ?? product.category;

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-3xl bg-surface p-0 dark:bg-card">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">{product.description}</DialogDescription>

        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-white/5">
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-1 text-xs font-semibold text-brand-accent-foreground">
                  {discount}% OFF
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`size-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                    i === activeImg ? "ring-brand" : "ring-transparent hover:ring-brand/30"
                  }`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand/80">
                {category}
              </span>
              <h2 className="mt-1 text-xl font-semibold leading-tight text-ink sm:text-2xl">
                {product.name}
              </h2>
              {product.brand && (
                <p className="mt-1 text-sm text-ink-muted">by {product.brand}</p>
              )}
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                <Star className="size-3 fill-brand" strokeWidth={0} />
                {product.rating} · {product.reviews} reviews
              </div>
            </div>

            <div className="flex items-baseline gap-3 border-y border-black/5 py-3 dark:border-white/10">
              <span className="text-3xl font-semibold text-ink">₹{product.price}</span>
              <span className="text-sm text-ink-muted line-through">₹{product.originalPrice}</span>
              {discount > 0 && (
                <span className="text-xs font-semibold text-brand-accent">Save {discount}%</span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-ink/85">{product.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-accent/50 p-3 dark:bg-white/5">
              {product.specs.map((s) => (
                <div key={s.label} className="text-xs">
                  <p className="text-ink-muted">{s.label}</p>
                  <p className="font-medium text-ink">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Seller */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 p-3 dark:border-white/10">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold text-ink">{product.seller}</span>
                  {product.verified && <ShieldCheck className="size-3.5 text-brand" />}
                </div>
                <p className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
                  <MapPin className="size-3" /> {product.village}, {product.district}
                </p>
              </div>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                {product.sellerType}
              </span>
            </div>

            {product.deliveryAvailable && (
              <p className="inline-flex items-center gap-2 text-xs text-brand">
                <Truck className="size-3.5" /> Delivery available to your village
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-ink-muted">Quantity</span>
              <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid size-8 place-items-center text-ink hover:text-brand"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-ink">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid size-8 place-items-center text-ink hover:text-brand"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-brand py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand/5">
                <ShoppingCart className="size-4" /> Add to Cart
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-medium text-brand-foreground shadow-sm transition-all hover:bg-brand-light hover:shadow-md">
                <Zap className="size-4" /> Buy Now
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-ink-muted">
              <button
                onClick={() => onToggleWishlist?.(product)}
                className="inline-flex items-center gap-1 hover:text-brand-accent"
              >
                <Heart className={`size-3.5 ${wishlisted ? "fill-brand-accent text-brand-accent" : ""}`} />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
              <button className="inline-flex items-center gap-1 hover:text-brand">
                <Share2 className="size-3.5" /> Share
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
