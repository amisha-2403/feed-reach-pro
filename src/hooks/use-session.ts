import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/roles";

interface SessionState {
  loading: boolean;
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  fullName: string | null;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    loading: true,
    user: null,
    session: null,
    role: null,
    fullName: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function hydrate(session: Session | null) {
      if (!session?.user) {
        if (!cancelled)
          setState({ loading: false, user: null, session: null, role: null, fullName: null });
        return;
      }
      const [{ data: roleRow }, { data: profileRow }] = await Promise.all([
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      setState({
        loading: false,
        user: session.user,
        session,
        role: (roleRow?.role as AppRole | undefined) ?? null,
        fullName: profileRow?.full_name ?? null,
      });
    }

    // Subscribe first, then read current session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session);
    });
    supabase.auth.getSession().then(({ data }) => hydrate(data.session));

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
