import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { Field, SubmitButton } from "./Field";
import { loginSchema, type LoginInput } from "@/lib/auth-schemas";
import { ROLE_DASHBOARDS, type AppRole } from "@/lib/roles";

export function LoginForm({
  onSwitchToRegister,
  redirectTo,
}: {
  onSwitchToRegister: () => void;
  redirectTo?: string;
}) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  async function onSubmit(values: LoginInput) {
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.user) {
      toast.error("Sign in failed");
      return;
    }

    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      navigate({ to: redirectTo });
      return;
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();

    const role = (roleRow?.role as AppRole | undefined) ?? "customer";
    toast.success("Signed in");
    navigate({ to: ROLE_DASHBOARDS[role] });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Field
        label="Password"
        type="password"
        autoComplete="current-password"
        {...register("password")}
        error={errors.password?.message}
      />
      <div className="flex justify-end -mt-1">
        <Link to="/forgot-password" className="text-xs font-medium text-brand hover:underline">
          Forgot password?
        </Link>
      </div>
      <SubmitButton loading={isSubmitting}>Sign in</SubmitButton>
      <p className="text-center text-xs text-ink-muted">
        New to FeedConnect?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-medium text-brand hover:underline"
        >
          Create an account
        </button>
      </p>
    </form>
  );
}
