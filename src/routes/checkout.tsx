import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/components/auth/UseAuth";
import { useCart } from "@/hooks/use-cart";
import { computeTotals, getCartLines } from "@/lib/cart-store";
import { PRODUCTS } from "@/lib/marketplace-data";
import { Input, Button } from "@/components/ui";

export const Route = createFileRoute("/checkout")({
  meta: {
    title: "Checkout — GramSetu",
    description: "Review your order, confirm delivery, and choose payment method.",
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const state = useCart();
  const lines = getCartLines(state.items);
  const totals = computeTotals(state);
  const isEmpty = lines.length === 0;

  // Prevent access without login
  if (!user) {
    navigate("/login");
    return null;
  }

  const handlePlaceOrder = async () => {
    // TODO: Implement actual order placement
    // - Create order in Supabase
    // - Notify seller
    // - Assign delivery partner
    // - Update order status
    alert("Order placed successfully! Order ID: ORD-XXXXX");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      <nav className="border-b border-black/5 px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/" className="font-semibold text-ink hover:text-brand">
            GramSetu
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/marketplace" className="text-ink muted text-sm">Marketplace</Link>
            <Link to="/cart" className="text-ink muted text-sm">Cart</Link>
            <Link to="/about-us" className="text-brand font-medium">About</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12">
        {isEmpty ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-20 h-20 rounded-full bg-brand/20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-brand mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-2">Your cart is empty</h2>
            <p className="text-ink muted">Add items from the marketplace to proceed with your order</p>
            <Link to="/marketplace" className="text-brand mt-4 hover:underline">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-black/5 pb-6 mb-8">
              <h2 className="text-2xl font-bold text-ink mb-2">Order Summary</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-ink muted">Items</span>
                  <span className="font-medium">{lines.length}</span>
                </div>
                <div>
                  <span className="text-ink muted">Subtotal</span>
                  <span className="font-medium">₹{totals.subtotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {totals.couponDiscount > 0 && (
                <div className="mt-2">
                  <span className="text-ink muted">Discount</span>
                  <span className="font-medium text-brand">-₹{totals.couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="mt-4 border-t border-black/5 pt-4">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-brand">₹{totals.grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">
                  Delivery Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="rounded-md border border-black/10 p-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={state.deliveryType === "standard"}
                      onChange={() => state.setDeliveryType("standard")}
                      className="peer"
                    />
                    <span>Standard ₹49</span>
                  </label>
                  <label className="rounded-md border border-black/10 p-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={state.deliveryType === "express"}
                      onChange={() => state.setDeliveryType("express")}
                      className="peer"
                    />
                    <span>Express ₹99</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="rounded-md border border-black/10 p-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked
                      className="peer"
                    />
                    <span>UPI</span>
                  </label>
                  <label className="rounded-md border border-black/10 p-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked
                      className="peer"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="rounded-md border border-black/10 p-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked
                      className="peer"
                    />
                    <span>Wallet</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full rounded-full bg-brand py-3 text-sm font-medium text-brand-foreground shadow-md hover:bg-brand-light transition-colors"
            >
              Place Order
            </button>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}