import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { Field, SubmitButton } from "./Field";
import { loginSchema, type LoginInput } from "@/lib/auth-schemas";
import { ROLE_DASHBOARDS, type AppRole } from "@/lib/roles";
import { getSafeAuthRedirect } from "@/lib/auth-redirect";

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
    let response: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
    try {
      response = await supabase.auth.signInWithPassword(values);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
      return;
    }
    const { data, error } = response;
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.user) {
      toast.error("Sign in failed");
      return;
    }

    const safeRedirect = getSafeAuthRedirect(redirectTo);
    if (safeRedirect) {
      toast.success("Signed in");
      navigate({ to: safeRedirect });
      return;
    }

    let role: AppRole = "customer";
    try {
      const { data: roleRow, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (roleError) console.error("Unable to load the signed-in user's role:", roleError);
      role = (roleRow?.role as AppRole | undefined) ?? "customer";
    } catch (cause) {
      console.error("Unable to load the signed-in user's role:", cause);
    }
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
        New to GramSetu?{" "}
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
