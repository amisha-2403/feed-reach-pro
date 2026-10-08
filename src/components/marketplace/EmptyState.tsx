import { PackageSearch, RotateCcw, Store } from "lucide-react";

interface Props {
  onClear: () => void;
  onBrowseAll: () => void;
}

export function EmptyState({ onClear, onBrowseAll }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-surface/50 p-12 text-center dark:border-white/10 dark:bg-white/[0.02]">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-brand/10 blur-2xl" />
        <div className="relative grid size-24 place-items-center rounded-full bg-gradient-to-br from-brand/15 to-brand-accent/15 ring-1 ring-brand/20">
          <PackageSearch className="size-10 text-brand" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-ink">No products found in your area.</h3>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        Try adjusting your filters, expanding the delivery radius, or browsing all products across
        villages on GramSetu.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-surface px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand dark:border-white/15 dark:bg-card dark:text-foreground"
        >
          <RotateCcw className="size-4" /> Clear Filters
        </button>
        <button
          onClick={onBrowseAll}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground shadow-sm transition-all hover:bg-brand-light hover:shadow-md"
        >
          <Store className="size-4" /> Browse All Products
        </button>
      </div>
    </div>
  );
}
