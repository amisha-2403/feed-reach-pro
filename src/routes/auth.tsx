import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ROLE_DASHBOARDS, type AppRole } from "@/lib/roles";

const authSearch = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: authSearch,
  head: () => ({
    meta: [
      { title: "Sign in — GramSetu" },
      { name: "description", content: "Sign in or create your GramSetu account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");

  // If already signed in, bounce to role dashboard
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();
      const role = (roleRow?.role as AppRole | undefined) ?? "customer";
      navigate({ to: search.redirect && search.redirect.startsWith("/") ? search.redirect : ROLE_DASHBOARDS[role] });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, search.redirect]);

  return (
    <AuthShell
      title={mode === "signin" ? "Welcome back" : "Create your GramSetu account"}
      subtitle={
        mode === "signin"
          ? "Sign in to place orders, manage your shop, or fulfill deliveries."
          : "Choose your role to get started. It takes less than a minute."
      }
    >
      {mode === "signin" ? (
        <LoginForm onSwitchToRegister={() => setMode("signup")} redirectTo={search.redirect} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setMode("signin")} />
      )}
    </AuthShell>
  );
}
