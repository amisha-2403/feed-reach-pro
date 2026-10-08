import { z } from "zod";

const email = z
  .string()
  .trim()
  .email({ message: "Enter a valid email address" })
  .max(255);

// Indian mobile: 10 digits, optionally +91 prefix
const phone = z
  .string()
  .trim()
  .regex(/^(\+?91[\s-]?)?[6-9]\d{9}$/, { message: "Enter a valid 10-digit mobile number" });

const strongPassword = z
  .string()
  .min(8, { message: "At least 8 characters" })
  .max(128)
  .regex(/[A-Z]/, { message: "Include an uppercase letter" })
  .regex(/[a-z]/, { message: "Include a lowercase letter" })
  .regex(/\d/, { message: "Include a number" });

const nonEmpty = (label: string, max = 120) =>
  z.string().trim().min(1, { message: `${label} is required` }).max(max);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { message: "Password is required" }).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

const passwordPair = z
  .object({ password: strongPassword, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const customerSignupSchema = z
  .object({
    role: z.literal("customer"),
    full_name: nonEmpty("Full name"),
    email,
    phone,
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const farmerSignupSchema = z
  .object({
    role: z.literal("farmer"),
    full_name: nonEmpty("Full name"),
    farm_name: nonEmpty("Farm name"),
    email,
    phone,
    village: nonEmpty("Village"),
    district: nonEmpty("District"),
    state: nonEmpty("State"),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const shopkeeperSignupSchema = z
  .object({
    role: z.literal("shopkeeper"),
    shop_name: nonEmpty("Shop name"),
    full_name: nonEmpty("Owner name"),
    email,
    phone,
    shop_address: nonEmpty("Shop address", 300),
    gst_number: z
      .string()
      .trim()
      .max(20)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v ? v : undefined)),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const deliverySignupSchema = z
  .object({
    role: z.literal("delivery"),
    full_name: nonEmpty("Full name"),
    phone,
    email,
    vehicle_type: nonEmpty("Vehicle type", 60),
    license_number: nonEmpty("License number", 40),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type CustomerSignup = z.infer<typeof customerSignupSchema>;
export type FarmerSignup = z.infer<typeof farmerSignupSchema>;
export type ShopkeeperSignup = z.infer<typeof shopkeeperSignupSchema>;
export type DeliverySignup = z.infer<typeof deliverySignupSchema>;

export type AnySignup =
  | CustomerSignup
  | FarmerSignup
  | ShopkeeperSignup
  | DeliverySignup;

export { passwordPair };
