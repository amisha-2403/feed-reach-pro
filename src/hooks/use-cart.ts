import { useSyncExternalStore } from "react";
import { cartStore, type CartState, setProducts } from "@/lib/cart-store";
import { fetchProducts, type Product } from "@/lib/supabase/products";
import { computeTotals, getCartLines } from "@/lib/cart-store";

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

/** Fetch products from Supabase and update the local PRODUCTS cache */
export const loadProductsFromSupabase = async () => {
  const { products, total } = await fetchProducts();
  setProducts(products);
  return { products, total };
};

/** Get a product by ID from the local cache */
export const getProductById = (productId: string): Product | undefined => {
  return PRODUCTS.find((p) => p.id === productId);
};

/** Sync current cart to Supabase */
export const syncCartToSupabase = async () => {
  await cartStore.syncToSupabase();
};