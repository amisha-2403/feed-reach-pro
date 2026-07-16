import { createFileRoute } from "@tanstack/react-router";
import { DashboardGrid, DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/shop")({
  head: () => ({ meta: [{ title: "Shop dashboard — GramSetu" }, { name: "robots", content: "noindex" }] }),
  component: ShopDashboard,
});

function ShopDashboard() {
  return (
    <DashboardShell
      role="shopkeeper"
      title="Run your feed shop online"
      description="Manage inventory, take digital orders, and reach farmers across your district."
    >
      <DashboardGrid
        items={[
          { title: "Inventory", body: "Track stock by brand, category, and batch." },
          { title: "Orders", body: "Accept, fulfill, and dispatch customer orders." },
          { title: "Farmer suppliers", body: "Buy raw grain directly from vetted local farmers." },
          { title: "Delivery partners", body: "Assign the right vehicle for every route." },
          { title: "Storefront", body: "Your shop page, live to farmers within 15 km." },
          { title: "Insights", body: "Weekly demand, top-selling feeds, low-stock alerts." },
        ]}
      />
    </DashboardShell>
  );
}
