import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { PRODUCTS } from "@/lib/marketplace-data";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description: "Fetch full details for one GramSetu marketplace product, including specs and seller info.",
  inputSchema: { productId: z.string().describe("Product id, e.g. 'p1'.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ productId }) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new ToolError(`No product found with id "${productId}".`);

    const lines = [
      `${product.name}${product.brand ? ` (${product.brand})` : ""}`,
      `Price: ₹${product.price} (was ₹${product.originalPrice})`,
      `Category: ${product.category} | Stock: ${product.stock} | Delivery: ${product.deliverySpeed}`,
      `Seller: ${product.seller} (${product.sellerType}${product.verified ? ", verified" : ""}) — ${product.village}, ${product.district}`,
      `Rating: ${product.rating} from ${product.reviews} reviews`,
      "",
      product.description,
      "",
      ...product.specs.map((s) => `- ${s.label}: ${s.value}`),
    ];

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      structuredContent: { product },
    };
  },
});
