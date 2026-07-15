import { createFileRoute } from "@tanstack/react-router";
import { DashboardGrid, DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/customer")({
  head: () => ({ meta: [{ title: "Customer dashboard — FeedConnect" }, { name: "robots", content: "noindex" }] }),
  component: CustomerDashboard,
});

function CustomerDashboard() {
  return (
    <DashboardShell
      role="customer"
      title="Order feed from nearby shops"
      description="Browse verified local shops within your district and place orders for same-day rural delivery."
    >
      <DashboardGrid
        items={[
          { title: "Nearby shops", body: "Discover feed shops within a 15 km radius of your farm." },
          { title: "Reorder essentials", body: "Repeat previous orders in one tap when stock runs low." },
          { title: "Live delivery tracking", body: "See where your feed sacks are, from shop to gate." },
          { title: "Household inventory", body: "Track feed on hand across cattle, poultry, and goats." },
          { title: "Trusted suppliers", body: "Every shop is verified by district and quality scored." },
          { title: "Support", body: "WhatsApp and phone support in your regional language." },
        ]}
      />
    </DashboardShell>
  );
}
