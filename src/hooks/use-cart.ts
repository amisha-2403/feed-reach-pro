import { useSyncExternalStore } from "react";
import { cartStore, type CartState } from "@/lib/cart-store";

const emptyState: CartState = {
  items: [],
  saved: [],
  couponCode: null,
  deliveryType: "standard",
};

export function useCart(): CartState {
  return useSyncExternalStore(
    (l) => cartStore.subscribe(l),
    () => cartStore.getState(),
    () => emptyState,
  );
}

export function useCartCount(): number {
  const s = useCart();
  return s.items.reduce((sum, i) => sum + i.qty, 0);
}
