import type { Product } from "./marketplace-data";
import { PRODUCTS } from "./marketplace-data";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CartItem {
  productId: string;
  qty: number;
  addedAt: number;
}

export interface CartState {
  items: CartItem[];
  saved: CartItem[];
  couponCode: string | null;
  deliveryType: "standard" | "express";
}

export interface Coupon {
  code: string;
  label: string;
  description: string;
  /** flat OR percent */
  kind: "flat" | "percent";
  value: number;
  minSubtotal?: number;
  maxDiscount?: number;
}

export const COUPONS: Coupon[] = [
  {
    code: "WELCOME100",
    label: "New here? ₹100 off",
    description: "Flat ₹100 off on orders above ₹499",
    kind: "flat",
    value: 100,
    minSubtotal: 499,
  },
  {
    code: "GRAMSETU50",
    label: "GramSetu community ₹50",
    description: "Flat ₹50 off on any order",
    kind: "flat",
    value: 50,
  },
  {
    code: "SAVE10",
    label: "Save 10%",
    description: "10% off on orders above ₹999 · max ₹250",
    kind: "percent",
    value: 10,
    minSubtotal: 999,
    maxDiscount: 250,
  },
  {
    code: "FIRSTORDER",
    label: "First-order 15%",
    description: "15% off on orders above ₹799 · max ₹400",
    kind: "percent",
    value: 15,
    minSubtotal: 799,
    maxDiscount: 400,
  },
];

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

const KEY = "gramsetu.cart.v1";
type Listener = (s: CartState) => void;

function initialState(): CartState {
  return { items: [], saved: [], couponCode: null, deliveryType: "standard" };
}

class CartStore {
  private state: CartState = initialState();
  private listeners = new Set<Listener>();
  private hydrated = false;

  private hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) this.state = { ...initialState(), ...JSON.parse(raw) };
      else {
        // Seed with a couple realistic items so demo is compelling
        this.state = {
          ...initialState(),
          items: [
            { productId: "p1", qty: 2, addedAt: Date.now() },
            { productId: "p3", qty: 1, addedAt: Date.now() },
            { productId: "p5", qty: 3, addedAt: Date.now() },
          ],
        };
      }
    } catch {
      this.state = initialState();
    }
    window.addEventListener("storage", (e) => {
      if (e.key === KEY && e.newValue) {
        try {
          this.state = { ...initialState(), ...JSON.parse(e.newValue) };
          this.emit();
        } catch {
          /* noop */
        }
      }
    });
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(this.state));
    } catch {
      /* noop */
    }
  }

  private emit() {
    for (const l of this.listeners) l(this.state);
  }

  private set(next: Partial<CartState>) {
    this.state = { ...this.state, ...next };
    this.persist();
    this.emit();
  }

  getState(): CartState {
    this.hydrate();
    return this.state;
  }

  subscribe(l: Listener): () => void {
    this.hydrate();
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  add(productId: string, qty = 1) {
    this.hydrate();
    const existing = this.state.items.find((i) => i.productId === productId);
    const items = existing
      ? this.state.items.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i,
        )
      : [...this.state.items, { productId, qty, addedAt: Date.now() }];
    // If it was saved, remove from saved
    const saved = this.state.saved.filter((i) => i.productId !== productId);
    this.set({ items, saved });
  }

  setQty(productId: string, qty: number) {
    if (qty <= 0) return this.remove(productId);
    this.set({
      items: this.state.items.map((i) =>
        i.productId === productId ? { ...i, qty } : i,
      ),
    });
  }

  remove(productId: string) {
    this.set({ items: this.state.items.filter((i) => i.productId !== productId) });
  }

  saveForLater(productId: string) {
    const item = this.state.items.find((i) => i.productId === productId);
    if (!item) return;
    this.set({
      items: this.state.items.filter((i) => i.productId !== productId),
      saved: [{ ...item, qty: 1 }, ...this.state.saved.filter((i) => i.productId !== productId)],
    });
  }

  moveToCart(productId: string) {
    const item = this.state.saved.find((i) => i.productId === productId);
    if (!item) return;
    this.set({
      saved: this.state.saved.filter((i) => i.productId !== productId),
      items: this.state.items.find((i) => i.productId === productId)
        ? this.state.items.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + item.qty } : i,
          )
        : [...this.state.items, item],
    });
  }

  removeSaved(productId: string) {
    this.set({ saved: this.state.saved.filter((i) => i.productId !== productId) });
  }

  applyCoupon(code: string): { ok: boolean; message: string } {
    const upper = code.trim().toUpperCase();
    const coupon = COUPONS.find((c) => c.code === upper);
    if (!coupon) return { ok: false, message: "Coupon code is not valid." };
    const totals = computeTotals(this.state, coupon.code);
    if (coupon.minSubtotal && totals.subtotal < coupon.minSubtotal) {
      return {
        ok: false,
        message: `Add ₹${coupon.minSubtotal - totals.subtotal} more to use ${coupon.code}.`,
      };
    }
    this.set({ couponCode: coupon.code });
    return { ok: true, message: `${coupon.code} applied — you saved ₹${totals.couponDiscount}.` };
  }

  removeCoupon() {
    this.set({ couponCode: null });
  }

  setDeliveryType(type: "standard" | "express") {
    this.set({ deliveryType: type });
  }

  clear() {
    this.set({ items: [], couponCode: null });
  }
}

export const cartStore = new CartStore();

/* ------------------------------------------------------------------ */
/*  Selectors / math                                                   */
/* ------------------------------------------------------------------ */

export interface CartLine {
  item: CartItem;
  product: Product;
  lineSubtotal: number;
  lineOriginal: number;
  lineDiscount: number;
}

export function getCartLines(items: CartItem[]): CartLine[] {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) continue;
    lines.push({
      item,
      product,
      lineSubtotal: product.price * item.qty,
      lineOriginal: product.originalPrice * item.qty,
      lineDiscount: (product.originalPrice - product.price) * item.qty,
    });
  }
  return lines;
}

export interface Totals {
  itemsTotal: number; // sum of original prices
  subtotal: number; // sum of discounted prices
  productDiscount: number;
  couponDiscount: number;
  delivery: number;
  gst: number;
  grandTotal: number;
  freeDeliveryEligible: boolean;
  freeDeliveryThreshold: number;
  amountToFreeDelivery: number;
}

const FREE_DELIVERY_THRESHOLD = 999;
const STANDARD_DELIVERY = 49;
const EXPRESS_DELIVERY = 99;
const GST_RATE = 0.05;

export function computeTotals(state: CartState, couponOverride?: string | null): Totals {
  const lines = getCartLines(state.items);
  const itemsTotal = lines.reduce((s, l) => s + l.lineOriginal, 0);
  const subtotal = lines.reduce((s, l) => s + l.lineSubtotal, 0);
  const productDiscount = itemsTotal - subtotal;

  const code = couponOverride === undefined ? state.couponCode : couponOverride;
  const coupon = code ? COUPONS.find((c) => c.code === code) : null;

  let couponDiscount = 0;
  if (coupon && (!coupon.minSubtotal || subtotal >= coupon.minSubtotal)) {
    couponDiscount =
      coupon.kind === "flat"
        ? coupon.value
        : Math.min(
            coupon.maxDiscount ?? Number.POSITIVE_INFINITY,
            Math.round((subtotal * coupon.value) / 100),
          );
    couponDiscount = Math.min(couponDiscount, subtotal);
  }

  const freeDeliveryEligible = subtotal >= FREE_DELIVERY_THRESHOLD;
  const baseDelivery = state.deliveryType === "express" ? EXPRESS_DELIVERY : STANDARD_DELIVERY;
  const delivery =
    subtotal === 0
      ? 0
      : freeDeliveryEligible && state.deliveryType === "standard"
        ? 0
        : baseDelivery;

  const taxable = Math.max(0, subtotal - couponDiscount);
  const gst = Math.round(taxable * GST_RATE);
  const grandTotal = Math.max(0, taxable + gst + delivery);

  return {
    itemsTotal,
    subtotal,
    productDiscount,
    couponDiscount,
    delivery,
    gst,
    grandTotal,
    freeDeliveryEligible,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    amountToFreeDelivery: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
  };
}

/* ------------------------------------------------------------------ */
/*  Delivery estimate helpers                                          */
/* ------------------------------------------------------------------ */

export function estimateDelivery(speed: Product["deliverySpeed"], type: "standard" | "express") {
  const now = new Date();
  const daysMap: Record<Product["deliverySpeed"], number> = {
    "same-day": 0,
    "next-day": 1,
    "2-3-days": type === "express" ? 1 : 3,
  };
  const days = type === "express" ? Math.max(0, daysMap[speed] - 1) : daysMap[speed];
  const eta = new Date(now);
  eta.setDate(now.getDate() + days);
  const label = eta.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const same = days === 0;
  return { label: same ? `Today, ${label.split(",")[1].trim()}` : label, days };
}
