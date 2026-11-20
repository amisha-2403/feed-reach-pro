import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useAuth } from "@/components/auth/UseAuth";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ROLE_DASHBOARDS } from "@/lib/roles";
import { getSafeAuthRedirect } from "@/lib/auth-redirect";

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
  const { user, isLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");

  // Keep auth-page redirects aligned with the shared Supabase session provider.
  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: getSafeAuthRedirect(search.redirect) ?? ROLE_DASHBOARDS[user.role] });
    }
  }, [isLoading, navigate, search.redirect, user]);

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
        <RegisterForm onSwitchToLogin={() => setMode("signin")} redirectTo={search.redirect} />
      )}
    </AuthShell>
  );
}
