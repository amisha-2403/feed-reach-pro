import { Search, Heart, ShoppingCart, User, MapPin, ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, DISTRICTS, SORT_OPTIONS, type SortId } from "@/lib/marketplace-data";

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  district: string;
  onDistrictChange: (v: string) => void;
  village: string;
  onVillageChange: (v: string) => void;
  sort: SortId;
  onSortChange: (v: SortId) => void;
  productCount: number;
  wishlistCount: number;
  cartCount: number;
  onOpenFilters?: () => void;
}

export function MarketplaceHeader({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  district,
  onDistrictChange,
  village,
  onVillageChange,
  sort,
  onSortChange,
  productCount,
  wishlistCount,
  cartCount,
  onOpenFilters,
}: Props) {
  const districtObj = DISTRICTS.find((d) => d.name === district);
  const villages = districtObj?.villages ?? [];

  return (
    <div className="sticky top-14 z-40 border-b border-black/5 bg-surface/95 backdrop-blur-md dark:border-white/10 dark:bg-background/90">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        {/* Top row: search + actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search feed, seeds, fertilizers, tools…"
              className="h-11 w-full rounded-full border border-black/10 bg-surface pl-10 pr-4 text-sm text-ink outline-none ring-brand/20 transition-all placeholder:text-ink-muted focus:border-brand/40 focus:ring-2 dark:border-white/10 dark:bg-card dark:text-foreground"
            />
          </div>

          <button
            onClick={onOpenFilters}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-surface px-3 text-sm font-medium text-ink transition-colors hover:border-brand/30 hover:text-brand lg:hidden dark:border-white/10 dark:bg-card dark:text-foreground"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            <IconAction label="Wishlist" count={wishlistCount}>
              <Heart className="size-5" />
            </IconAction>
            <IconAction label="Cart" count={cartCount}>
              <ShoppingCart className="size-5" />
            </IconAction>
            <IconAction label="Profile">
              <User className="size-5" />
            </IconAction>
          </div>
        </div>

        {/* Bottom row: selectors + count */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SelectPill
            value={category}
            onValueChange={onCategoryChange}
            placeholder="All Categories"
            width="w-[170px]"
          >
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectPill>

          <SelectPill
            value={district}
            onValueChange={(v) => {
              onDistrictChange(v);
              onVillageChange("all");
            }}
            placeholder="District"
            width="w-[150px]"
            icon={<MapPin className="size-3.5" />}
          >
            <SelectItem value="all">All Districts</SelectItem>
            {DISTRICTS.map((d) => (
              <SelectItem key={d.name} value={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectPill>

          <SelectPill
            value={village}
            onValueChange={onVillageChange}
            placeholder="Village"
            width="w-[140px]"
            disabled={district === "all"}
          >
            <SelectItem value="all">All Villages</SelectItem>
            {villages.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectPill>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-ink-muted sm:inline">
              <span className="font-semibold text-ink">{productCount}</span> products
            </span>
            <SelectPill
              value={sort}
              onValueChange={(v) => onSortChange(v as SortId)}
              placeholder="Sort"
              width="w-[170px]"
            >
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  Sort: {s.label}
                </SelectItem>
              ))}
            </SelectPill>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectPill({
  value,
  onValueChange,
  placeholder,
  children,
  width,
  disabled,
  icon,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
  width: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={`${width} h-9 rounded-full border-black/10 bg-surface text-xs font-medium text-ink shadow-none dark:border-white/10 dark:bg-card dark:text-foreground`}
      >
        <span className="flex items-center gap-1.5 text-ink-muted">
          {icon}
          <SelectValue placeholder={placeholder} />
        </span>
      </SelectTrigger>
      <SelectContent className="rounded-xl">{children}</SelectContent>
    </Select>
  );
}

function IconAction({
  children,
  label,
  count,
}: {
  children: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-accent hover:text-brand dark:text-foreground dark:hover:bg-white/5"
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-brand-accent-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

// keep unused ChevronDown import from being flagged
void ChevronDown;
