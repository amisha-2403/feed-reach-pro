import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { PRODUCTS } from "@/lib/marketplace-data";

function summarize(p: (typeof PRODUCTS)[number]) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand ?? null,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category,
    seller: p.seller,
    sellerType: p.sellerType,
    village: p.village,
    district: p.district,
    verified: p.verified,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    deliverySpeed: p.deliverySpeed,
    tags: p.tags,
  };
}

export default defineTool({
  name: "search_products",
  title: "Search marketplace products",
  description:
    "Search the GramSetu agri-marketplace catalog by keyword, category, district, seller type, or price range.",
  inputSchema: {
    query: z.string().optional().describe("Free-text search over product name, brand, and description."),
    category: z.string().optional().describe("Category id or name, e.g. 'animal-feed' or 'Seeds'."),
    district: z.string().optional().describe("District to filter sellers by."),
    sellerType: z.enum(["Shop", "Farmer", "Cooperative"]).optional(),
    maxPrice: z.number().optional().describe("Maximum price in INR."),
    limit: z.number().optional().describe("Max results to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, district, sellerType, maxPrice, limit }) => {
    const q = query?.trim().toLowerCase();
    const cat = category?.trim().toLowerCase();
    const dist = district?.trim().toLowerCase();

    const results = PRODUCTS.filter((p) => {
      if (q && !`${p.name} ${p.brand ?? ""} ${p.description}`.toLowerCase().includes(q)) return false;
      if (cat && !p.category.toLowerCase().includes(cat) && !cat.includes(p.category.toLowerCase()))
        return false;
      if (dist && p.district.toLowerCase() !== dist) return false;
      if (sellerType && p.sellerType !== sellerType) return false;
      if (typeof maxPrice === "number" && p.price > maxPrice) return false;
      return true;
    }).slice(0, Math.max(1, Math.min(limit ?? 10, 50)));

    const items = results.map(summarize);
    return {
      content: [
        {
          type: "text" as const,
          text:
            items.length === 0
              ? "No matching products found."
              : items.map((p) => `${p.name} — ₹${p.price} (${p.seller}, ${p.village}, ${p.district})`).join("\n"),
        },
      ],
      structuredContent: { count: items.length, products: items },
    };
  },
});
