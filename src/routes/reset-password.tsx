import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, SubmitButton } from "@/components/auth/Field";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/auth-schemas";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — FeedConnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  // Supabase drops a recovery access_token into the URL hash; the client
  // consumes it automatically and fires PASSWORD_RECOVERY.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
        setChecking(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema), mode: "onBlur" });

  async function onSubmit({ password }: ResetPasswordInput) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Link to="/auth" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      {checking ? (
        <p className="text-sm text-ink-muted">Verifying reset link…</p>
      ) : !ready ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-ink">
          This reset link is invalid or has expired. Request a new one from the{" "}
          <Link to="/forgot-password" className="font-medium text-brand hover:underline">
            forgot password
          </Link>{" "}
          page.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Field
            label="New password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            error={errors.password?.message}
            hint="8+ chars, upper, lower, number"
          />
          <Field
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <SubmitButton loading={isSubmitting}>Update password</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
