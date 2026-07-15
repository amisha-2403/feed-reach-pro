export type AppRole = "customer" | "farmer" | "shopkeeper" | "delivery" | "admin";

export const ROLE_LABELS: Record<AppRole, string> = {
  customer: "Customer",
  farmer: "Farmer",
  shopkeeper: "Shopkeeper",
  delivery: "Delivery Partner",
  admin: "Administrator",
};

export const ROLE_DASHBOARDS: Record<AppRole, string> = {
  customer: "/customer",
  farmer: "/farmer",
  shopkeeper: "/shop",
  delivery: "/delivery",
  admin: "/admin",
};

export const SIGNUP_ROLES: AppRole[] = ["customer", "farmer", "shopkeeper", "delivery"];
