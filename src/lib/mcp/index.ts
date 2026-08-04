import { auth, defineMcp } from "@lovable.dev/mcp-js";

import searchProductsTool from "./tools/search-products";
import getProductTool from "./tools/get-product";
import listSellersTool from "./tools/list-sellers";
import getMyProfileTool from "./tools/get-my-profile";

// The OAuth issuer must be the direct Supabase host; the project ref is the only
// value that survives publish unchanged and Vite inlines it at build time.
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "feedconnect-local-feed-solutions",
  title: "FeedConnect: Local Feed Solutions",
  version: "0.1.0",
  instructions:
    "Tools for GramSetu, a village-to-village agri-commerce marketplace. Use `search_products` and `get_product` to browse feed, seeds, fertilizer and equipment listings, `list_sellers` to find verified local shops, farmers and cooperatives, and `get_my_profile` to read the signed-in user's account and role.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchProductsTool, getProductTool, listSellersTool, getMyProfileTool],
});
