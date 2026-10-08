import { MapPin, ShieldCheck, Star, Store, Sprout, Users } from "lucide-react";
import type { Seller } from "@/lib/marketplace-data";

const TYPE_ICON = {
  Shop: Store,
  Farmer: Sprout,
  Cooperative: Users,
} as const;

export function SellerCard({ seller }: { seller: Seller }) {
  const TypeIcon = TYPE_ICON[seller.type];
  return (
    <article className="group overflow-hidden rounded-2xl bg-surface ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-brand/25 dark:bg-card dark:ring-white/10">
      <div className="relative h-24 overflow-hidden bg-zinc-100">
        <img
          src={seller.cover}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="-mt-8 px-5 pb-5">
        <div className="flex items-start gap-3">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="size-16 shrink-0 rounded-2xl object-cover ring-4 ring-surface dark:ring-card"
          />
          <div className="min-w-0 pt-8">
            <div className="flex items-center gap-1.5">
              <h4 className="truncate text-sm font-semibold text-ink">{seller.name}</h4>
              {seller.verified && <ShieldCheck className="size-3.5 shrink-0 text-brand" />}
            </div>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink-muted">
              <TypeIcon className="size-3" /> {seller.type} · since {seller.since}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" /> {seller.village}, {seller.district}
          </span>
          <span className="inline-flex items-center gap-1 text-brand">
            <Star className="size-3 fill-brand" strokeWidth={0} /> {seller.rating}
          </span>
          <span>{seller.productsListed} products</span>
        </div>

        <button className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-black/10 py-2 text-xs font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand hover:text-brand-foreground dark:border-white/15 dark:text-foreground">
          Visit Store
        </button>
      </div>
    </article>
  );
}
