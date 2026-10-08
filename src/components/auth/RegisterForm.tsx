import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { Field, SelectField, SubmitButton, TextAreaField } from "./Field";
import { ROLE_DASHBOARDS, ROLE_LABELS, SIGNUP_ROLES, type AppRole } from "@/lib/roles";
import {
  customerSignupSchema,
  deliverySignupSchema,
  farmerSignupSchema,
  shopkeeperSignupSchema,
  type AnySignup,
} from "@/lib/auth-schemas";

const schemaByRole = {
  customer: customerSignupSchema,
  farmer: farmerSignupSchema,
  shopkeeper: shopkeeperSignupSchema,
  delivery: deliverySignupSchema,
} as const;

type Role = Exclude<AppRole, "admin">;

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [role, setRole] = useState<Role>("customer");
  return (
    <div className="flex flex-col gap-6">
      <RoleTabs value={role} onChange={setRole} />
      <RoleForm key={role} role={role} onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
}

function RoleTabs({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Register as"
      className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1 sm:grid-cols-4 dark:bg-white/5"
    >
      {SIGNUP_ROLES.map((r) => {
        const active = r === value;
        return (
          <button
            key={r}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r as Role)}
            className={
              "rounded-md px-3 py-2 text-xs font-medium transition-all " +
              (active
                ? "bg-white text-brand shadow-sm dark:bg-background"
                : "text-ink/60 hover:text-ink dark:text-foreground/60")
            }
          >
            {ROLE_LABELS[r]}
          </button>
        );
      })}
    </div>
  );
}

function RoleForm({ role, onSwitchToLogin }: { role: Role; onSwitchToLogin: () => void }) {
  const navigate = useNavigate();
  const schema = useMemo(() => schemaByRole[role], [role]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: { role },
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const err = errors as Record<string, { message?: string } | undefined>;

  async function onSubmit(raw: Record<string, unknown>) {
    const values = raw as AnySignup;
    const { email, password } = values;
    const meta: Record<string, string | undefined> = { role: values.role };
    if ("full_name" in values) meta.full_name = values.full_name;
    if ("phone" in values) meta.phone = values.phone;
    if (values.role === "farmer") {
      meta.farm_name = values.farm_name;
      meta.village = values.village;
      meta.district = values.district;
      meta.state = values.state;
    }
    if (values.role === "shopkeeper") {
      meta.shop_name = values.shop_name;
      meta.shop_address = values.shop_address;
      if (values.gst_number) meta.gst_number = values.gst_number;
    }
    if (values.role === "delivery") {
      meta.vehicle_type = values.vehicle_type;
      meta.license_number = values.license_number;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: meta,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Account created. Please sign in to continue.");
      onSwitchToLogin();
      return;
    }
    toast.success(`Welcome to GramSetu, ${meta.full_name ?? ""}`);
    navigate({ to: ROLE_DASHBOARDS[values.role] });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <input type="hidden" value={role} {...register("role" as never)} />
      {role === "customer" && (
        <>
          <Field label="Full name" autoComplete="name" {...register("full_name" as never)} error={err.full_name?.message} />
          <Field label="Email" type="email" autoComplete="email" {...register("email" as never)} error={err.email?.message} />
          <Field label="Phone number" type="tel" autoComplete="tel" placeholder="9876543210" {...register("phone" as never)} error={err.phone?.message} />
          <PasswordPair errors={err} register={register} />
        </>
      )}

      {role === "farmer" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" autoComplete="name" {...register("full_name" as never)} error={err.full_name?.message} />
            <Field label="Farm name" {...register("farm_name" as never)} error={err.farm_name?.message} />
          </div>
          <Field label="Email" type="email" autoComplete="email" {...register("email" as never)} error={err.email?.message} />
          <Field label="Phone" type="tel" autoComplete="tel" placeholder="9876543210" {...register("phone" as never)} error={err.phone?.message} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Village" {...register("village" as never)} error={err.village?.message} />
            <Field label="District" {...register("district" as never)} error={err.district?.message} />
            <Field label="State" {...register("state" as never)} error={err.state?.message} />
          </div>
          <PasswordPair errors={err} register={register} />
        </>
      )}

      {role === "shopkeeper" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Shop name" {...register("shop_name" as never)} error={err.shop_name?.message} />
            <Field label="Owner name" autoComplete="name" {...register("full_name" as never)} error={err.full_name?.message} />
          </div>
          <Field label="Email" type="email" autoComplete="email" {...register("email" as never)} error={err.email?.message} />
          <Field label="Phone" type="tel" autoComplete="tel" placeholder="9876543210" {...register("phone" as never)} error={err.phone?.message} />
          <TextAreaField label="Shop address" {...register("shop_address" as never)} error={err.shop_address?.message} />
          <Field label="GST number (optional)" {...register("gst_number" as never)} error={err.gst_number?.message} />
          <PasswordPair errors={err} register={register} />
        </>
      )}

      {role === "delivery" && (
        <>
          <Field label="Full name" autoComplete="name" {...register("full_name" as never)} error={err.full_name?.message} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phone" type="tel" autoComplete="tel" placeholder="9876543210" {...register("phone" as never)} error={err.phone?.message} />
            <Field label="Email" type="email" autoComplete="email" {...register("email" as never)} error={err.email?.message} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField label="Vehicle type" defaultValue="" {...register("vehicle_type" as never)} error={err.vehicle_type?.message}>
              <option value="" disabled>Select vehicle</option>
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="auto">Auto rickshaw</option>
              <option value="tempo">Tempo</option>
              <option value="mini_truck">Mini truck</option>
              <option value="tractor">Tractor</option>
            </SelectField>
            <Field label="License number" {...register("license_number" as never)} error={err.license_number?.message} />
          </div>
          <PasswordPair errors={err} register={register} />
        </>
      )}

      <SubmitButton loading={isSubmitting}>Create account</SubmitButton>
      <p className="text-center text-xs text-ink-muted">
        Already registered?{" "}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-brand hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}

function PasswordPair({
  register,
  errors,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: ReturnType<typeof useForm<any>>["register"];
  errors: Record<string, { message?: string } | undefined>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field
        label="Password"
        type="password"
        autoComplete="new-password"
        {...register("password" as never)}
        error={errors.password?.message}
        hint="8+ chars, upper, lower, number"
      />
      <Field
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        {...register("confirmPassword" as never)}
        error={errors.confirmPassword?.message}
      />
    </div>
  );
}
