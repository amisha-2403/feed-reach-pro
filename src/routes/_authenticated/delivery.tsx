import { createFileRoute } from "@tanstack/react-router";
import { DashboardGrid, DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/delivery")({
  head: () => ({ meta: [{ title: "Delivery dashboard — FeedConnect" }, { name: "robots", content: "noindex" }] }),
  component: DeliveryDashboard,
});

function DeliveryDashboard() {
  return (
    <DashboardShell
      role="delivery"
      title="Fulfill hyperlocal feed deliveries"
      description="Pick up jobs from nearby shops and deliver feed to farms across your route."
    >
      <DashboardGrid
        items={[
          { title: "Available jobs", body: "Live pickups from shops within your route." },
          { title: "Active trip", body: "Turn-by-turn navigation for the current delivery." },
          { title: "Earnings", body: "Per-trip payout, weekly summaries, and settlements." },
          { title: "Vehicle & documents", body: "Keep license and vehicle papers verified." },
          { title: "Delivery history", body: "Review past trips, ratings, and tips." },
          { title: "Support", body: "24×7 dispatch help for on-road issues." },
        ]}
      />
    </DashboardShell>
  );
}
