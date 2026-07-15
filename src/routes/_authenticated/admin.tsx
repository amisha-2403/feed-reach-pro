import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DashboardGrid, DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard — FeedConnect" }, { name: "robots", content: "noindex" }] }),
  ssr: false,
  beforeLoad: async () => {
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) throw redirect({ to: "/auth" });
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userRes.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw redirect({ to: "/customer" });
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <DashboardShell
      role="admin"
      title="Platform administration"
      description="Oversee shops, farmers, delivery partners, and platform health across districts."
    >
      <DashboardGrid
        items={[
          { title: "User management", body: "Approve shops, verify farmers, onboard delivery partners." },
          { title: "Roles & permissions", body: "Grant or revoke admin access safely." },
          { title: "District coverage", body: "See where FeedConnect is active and gaps to fill." },
          { title: "Compliance", body: "GST, license, and vehicle verification queue." },
          { title: "Support tickets", body: "Escalated issues across the four sides of the platform." },
          { title: "Platform health", body: "Order volumes, fulfillment SLAs, and uptime." },
        ]}
      />
    </DashboardShell>
  );
}
