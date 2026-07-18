import { Star, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES, DISTRICTS, ALL_VILLAGES } from "@/lib/marketplace-data";

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sellerTypes: string[];
  availability: string[];
  minRating: number;
  deliverySpeeds: string[];
  villages: string[];
  districts: string[];
  verifiedOnly: boolean;
  discountOnly: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, 2000],
  sellerTypes: [],
  availability: [],
  minRating: 0,
  deliverySpeeds: [],
  villages: [],
  districts: [],
  verifiedOnly: false,
  discountOnly: false,
};

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
}

export function FiltersSidebar({ filters, onChange, onReset }: Props) {
  const toggle = <K extends keyof FilterState>(key: K, value: string) => {
    const arr = filters[key] as string[];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <aside className="flex flex-col gap-6 rounded-2xl bg-surface p-5 ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Filters</h3>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-light"
        >
          <X className="size-3" /> Clear all
        </button>
      </div>

      <Group title="Category">
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c.id}
            id={`cat-${c.id}`}
            label={c.name}
            hint={`${c.count}`}
            checked={filters.categories.includes(c.id)}
            onChange={() => toggle("categories", c.id)}
          />
        ))}
      </Group>

      <Group title="Price Range">
        <div className="px-1">
          <Slider
            min={0}
            max={2000}
            step={50}
            value={filters.priceRange}
            onValueChange={(v) =>
              onChange({ ...filters, priceRange: [v[0], v[1]] as [number, number] })
            }
          />
          <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </Group>

      <Group title="Seller Type">
        {(["Farmer", "Shop", "Cooperative"] as const).map((t) => (
          <CheckRow
            key={t}
            id={`st-${t}`}
            label={t === "Shop" ? "Village Shop" : t}
            checked={filters.sellerTypes.includes(t)}
            onChange={() => toggle("sellerTypes", t)}
          />
        ))}
      </Group>

      <Group title="Availability">
        {[
          { id: "in-stock", label: "In Stock" },
          { id: "out-of-stock", label: "Out of Stock" },
        ].map((a) => (
          <CheckRow
            key={a.id}
            id={`av-${a.id}`}
            label={a.label}
            checked={filters.availability.includes(a.id)}
            onChange={() => toggle("availability", a.id)}
          />
        ))}
      </Group>

      <Group title="Ratings">
        {[4, 3, 2].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange({ ...filters, minRating: filters.minRating === r ? 0 : r })}
            className={`flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-colors ${
              filters.minRating === r ? "bg-brand/10 text-brand" : "text-ink hover:bg-accent"
            }`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3.5 ${i < r ? "fill-brand-accent text-brand-accent" : "text-ink-muted"}`}
                strokeWidth={0}
              />
            ))}
            <span className="ml-1">& up</span>
          </button>
        ))}
      </Group>

      <Group title="Delivery">
        {[
          { id: "same-day", label: "Same Day" },
          { id: "next-day", label: "Next Day" },
        ].map((d) => (
          <CheckRow
            key={d.id}
            id={`dl-${d.id}`}
            label={d.label}
            checked={filters.deliverySpeeds.includes(d.id)}
            onChange={() => toggle("deliverySpeeds", d.id)}
          />
        ))}
      </Group>

      <Group title="District">
        <div className="max-h-32 space-y-0.5 overflow-y-auto pr-1">
          {DISTRICTS.map((d) => (
            <CheckRow
              key={d.name}
              id={`ds-${d.name}`}
              label={d.name}
              checked={filters.districts.includes(d.name)}
              onChange={() => toggle("districts", d.name)}
            />
          ))}
        </div>
      </Group>

      <Group title="Village">
        <div className="max-h-32 space-y-0.5 overflow-y-auto pr-1">
          {ALL_VILLAGES.map((v) => (
            <CheckRow
              key={v}
              id={`vl-${v}`}
              label={v}
              checked={filters.villages.includes(v)}
              onChange={() => toggle("villages", v)}
            />
          ))}
        </div>
      </Group>

      <div className="space-y-3 border-t border-black/5 pt-4 dark:border-white/10">
        <SwitchRow
          label="Verified sellers only"
          checked={filters.verifiedOnly}
          onChange={(v) => onChange({ ...filters, verifiedOnly: v })}
        />
        <SwitchRow
          label="Discount offers only"
          checked={filters.discountOnly}
          onChange={(v) => onChange({ ...filters, discountOnly: v })}
        />
      </div>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CheckRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-ink transition-colors hover:bg-accent dark:text-foreground dark:hover:bg-white/5"
    >
      <span className="flex items-center gap-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
        {label}
      </span>
      {hint && <span className="text-[10px] text-ink-muted">{hint}</span>}
    </label>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between text-xs text-ink">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
