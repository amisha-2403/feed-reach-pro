import { defineTool } from "@lovable.dev/mcp-js";

import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_my_profile",
  title: "Get my GramSetu profile",
  description:
    "Return the signed-in GramSetu user's profile and role (customer, farmer, shop, delivery, admin).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text" as const, text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    const [{ data: profile, error: profileError }, { data: roles, error: roleError }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    const error = profileError ?? roleError;
    if (error) {
      return { content: [{ type: "text" as const, text: error.message }], isError: true };
    }

    const roleList = (roles ?? []).map((r: { role: string }) => r.role);
    return {
      content: [
        {
          type: "text" as const,
          text: profile
            ? `${(profile as { full_name?: string }).full_name ?? "GramSetu user"} — roles: ${roleList.join(", ") || "none"}`
            : "No profile row found for this account.",
        },
      ],
      structuredContent: { profile: profile ?? null, roles: roleList },
    };
  },
});
