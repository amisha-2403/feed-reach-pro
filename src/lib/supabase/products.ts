import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductCategory } from "./marketplace-data";

export interface ProductFilters {
  query?: string;
  category?: string;
  district?: string;
  village?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "discount";
  minRating?: number;
  verifiedOnly?: boolean;
  discountOnly?: boolean;
}

export const fetchProducts = async (filters: ProductFilters = {}) => {
  let query = supabase.from("products").select("*", { count: "exact" });

  // Filter by query
  if (filters.query) {
    query = query.or(`name.ilike.%${filters.query}%,brand.ilike.%${filters.query}%,seller.ilike.%${filters.query}%`);
  }

  // Filter by category
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  // Filter by district
  if (filters.district && filters.district !== "all") {
    query = query.eq("district", filters.district);
  }

  // Filter by village
  if (filters.village && filters.village !== "all") {
    query = query.eq("village", filters.village);
  }

  // Filter by verified only
  if (filters.verifiedOnly) {
    query = query.eq("verified", true);
  }

  // Filter by discount only
  if (filters.discountOnly) {
    query = query.gt("original_price", "price");
  }

  // Filter by minimum rating
  if (filters.minRating) {
    query = query.gte("rating", filters.minRating);
  }

  // Execute query
  const { data, error, count } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }

  return { products: data as Product[], total: count || 0 };
};

export const fetchFeaturedProducts = async (limit = 8) => {
  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("verified", true)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return { products: [], total: 0 };
  }

  return { products: data as Product[], total: count || 0 };
};

export const fetchProductById = async (productId: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
};

export const fetchProductsByCategory = async (category: string, filters: ProductFilters = {}) => {
  let query = supabase.from("products").select("*", { count: "exact" }).eq("category", category);

  if (filters.query) {
    query = query.or(`name.ilike.%${filters.query}%,brand.ilike.%${filters.query}%,seller.ilike.%${filters.query}%`);
  }

  if (filters.minRating) {
    query = query.gte("rating", filters.minRating);
  }

  if (filters.verifiedOnly) {
    query = query.eq("verified", true);
  }

  const { data, error, count } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products by category:", error);
    return { products: [], total: 0 };
  }

  return { products: data as Product[], total: count || 0 };
};

export const fetchSellers = async () => {
  // Fetch distinct sellers from products
  const { data, error } = await supabase
    .from("products")
    .select("seller_id, seller, seller_type")
    .not("seller_id", "is", null);

  if (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }

  // Return unique sellers
  const uniqueSellers = Array.from(new Map(data.map((p: any) => [p.seller_id, p])).values());
  return uniqueSellers;
};