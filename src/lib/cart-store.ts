import type { Product } from "./marketplace-data";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "gramsetu.cart.v1";

type Listener = (s: CartState) => void;

function initialState(): CartState {
  return { items: [], saved: [], couponCode: null, deliveryType: "standard" };
}

class CartStore {
  private state: CartState = initialState();
  private listeners = new Set<Listener>();
  private initialized = false;

  private async initialize() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    // First, try to hydrate from localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.state = JSON.parse(raw);
    } catch {
      this.state = initialState();
    }

    // Then sync with Supabase if user is logged in
    try {
      const { data: { session} } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error fetching cart from Supabase:", error);
          return;
        }

        if (data && data.length > 0) {
          // Merge Supabase cart with localStorage, giving priority to Supabase
          const supabaseItems = data
            .filter((item: any) => item.qty > 0)
            .map((item: any) => ({
              productId: item.product_id,
              qty: item.qty,
              addedAt: item.added_at?.toDate().getTime() || Date.now(),
            }));

          const supabaseSaved = data
            .filter((item: any) => item.saved && item.saved === true)
            .map((item: any) => ({
              productId: item.product_id,
              qty: item.qty || 1,
              addedAt: item.added_at?.toDate().getTime() || Date.now(),
            }));

          // Merge items: keep localStorage items, but update quantities from Supabase
          const mergedItems = this.mergeCartItems(supabaseItems);
          const mergedSaved = this.mergeCartItems(supabaseSaved, true);

          this.state = {
            items: mergedItems,
            saved: mergedSaved,
            couponCode: data[0]?.coupon_code || this.state.couponCode,
            deliveryType: data[0]?.delivery_type || this.state.deliveryType,
          };
        }
      }
    } catch (e) {
      console.error("Cart Supabase sync error:", e);
    }

    this.emit();
  }

  private mergeCartItems(items: any[], isSaved = false) {
    const result: any[] = [];
    const existingIds = new Set(
      this.state.items.map((i: any) => i.productId)
    );

    for (const item of items) {
      if (existingIds.has(item.productId)) {
        // Update existing item quantity
        const existing = this.state.items.find((i: any) => i.productId === item.productId);
        if (existing) {
          result.push({
            productId: item.productId,
            qty: item.qty,
            addedAt: item.addedAt || existing.addedAt,
          });
        }
      } else {
        // Add new item
        result.push({
          productId: item.productId,
          qty: item.qty,
          addedAt: item.addedAt || Date.now(),
        });
      }
    }
    return result;
  }

  private emit() {
    for (const l of this.listeners) l(this.state);
  }

  private set(next: Partial<CartState>) {
    this.state = { ...this.state, ...next };
    this.persistToLocalStorage();
    this.emit();
  }

  async subscribe(l: Listener): () => void {
    await this.initialize();
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  add(productId: string, qty = 1) {
    this.initialize();
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
    const validCoupons = ["WELCOME100", "GRAMSETU50", "SAVE10", "FIRSTORDER"];
    if (!validCoupons.includes(upper)) return { ok: false, message: "Coupon code is not valid." };
    this.set({ couponCode: upper });
    return { ok: true, message: `${upper} applied` };
  }

  removeCoupon() {
    this.set({ couponCode: null });
  }

  setDeliveryType(type: "standard" | "express") {
    this.set({ deliveryType: type });
  }

  // Sync cart to Supabase (call after cart changes)
  async syncToSupabase() {
    const { data: { session} } = await supabase.auth.getSession();
    if (session) {
      try {
        await supabase.from("cart_items").upsert({
          user_id: session.user.id,
          items: this.state.items.map((i: any) => ({
            product_id: i.productId,
            qty: i.qty,
            saved: i.saved && i.saved.some((si: any) => si.productId === i.productId),
            added_at: new Date(i.addedAt),
          })),
          coupon_code: this.state.couponCode,
          delivery_type: this.state.deliveryType,
          updated_at: new Date(),
        });
      } catch (e) {
        console.error("Error syncing cart to Supabase:", e);
      }
    }
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

// Need to import PRODUCTS - will be set by the hook
let PRODUCTS: Product[] = [];

export function setProducts(products: Product[]) {
  PRODUCTS = products;
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
  const coupon = code ? ["WELCOME100", "GRAMSETU50", "SAVE10", "FIRSTORDER"].find((c) => c === code) : null;

  let couponDiscount = 0;
  if (coupon) {
    const couponDiscounts: Record<string, { kind: "flat" | "percent"; value: number; minSubtotal?: number; maxDiscount?: number }> = {
      WELCOME100: { kind: "flat", value: 100, minSubtotal: 499 },
      GRAMSETU50: { kind: "flat", value: 50 },
      SAVE10: { kind: "percent", value: 10, minSubtotal: 999, maxDiscount: 250 },
      FIRSTORDER: { kind: "percent", value: 15, minSubtotal: 799, maxDiscount: 400 },
    };
    const c = couponDiscounts[coupon];
    if (c) {
      if (c.kind === "flat") {
        couponDiscount = c.value;
      } else {
        couponDiscount = Math.min(
          c.maxDiscount ?? Number.POSITIVE_INFINITY,
          Math.round((subtotal * c.value) / 100),
        );
      }
    }
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