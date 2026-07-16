import { createFileRoute } from "@tanstack/react-router";
import { DashboardGrid, DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/farmer")({
  head: () => ({ meta: [{ title: "Farmer dashboard — GramSetu" }, { name: "robots", content: "noindex" }] }),
  component: FarmerDashboard,
});

function FarmerDashboard() {
  return (
    <DashboardShell
      role="farmer"
      title="Supply grain directly to the network"
      description="List your produce, coordinate pickups with local shops, and get paid on delivery."
    >
      <DashboardGrid
        items={[
          { title: "List a lot", body: "Post available grain, quantity, and quality grade." },
          { title: "Shop offers", body: "Compare live offers from district shops and mills." },
          { title: "Pickup schedule", body: "Assign a delivery partner or self-deliver." },
          { title: "Settlements", body: "Track paid, pending, and disputed transactions." },
          { title: "Season planner", body: "Plan harvests around district-wide demand curves." },
          { title: "Support", body: "Talk to our farmer success desk any working day." },
        ]}
      />
    </DashboardShell>
  );
}
