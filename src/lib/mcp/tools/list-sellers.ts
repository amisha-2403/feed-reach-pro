import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { SELLERS } from "@/lib/marketplace-data";

export default defineTool({
  name: "list_sellers",
  title: "List marketplace sellers",
  description: "List verified shops, farmers, and cooperatives selling on GramSetu, optionally filtered.",
  inputSchema: {
    district: z.string().optional().describe("District to filter by."),
    type: z.enum(["Shop", "Farmer", "Cooperative"]).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ district, type }) => {
    const dist = district?.trim().toLowerCase();
    const sellers = SELLERS.filter(
      (s) => (!dist || s.district.toLowerCase() === dist) && (!type || s.type === type),
    );
    return {
      content: [
        {
          type: "text" as const,
          text:
            sellers.length === 0
              ? "No sellers matched those filters."
              : sellers
                  .map(
                    (s) =>
                      `${s.name} — ${s.type}, ${s.village}, ${s.district} | ${s.productsListed} listings | ${s.rating}★${s.verified ? " | verified" : ""}`,
                  )
                  .join("\n"),
        },
      ],
      structuredContent: { count: sellers.length, sellers },
    };
  },
});
