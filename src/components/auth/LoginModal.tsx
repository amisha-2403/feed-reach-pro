import { useState } from "react";
import { useAuth } from "@/components/auth/UseAuth";
import { Link } from "@tanstack/react-router";
import { Input, Button, AlertDialog, AlertDialogAction, AlertDialogCancel } from "@/components/ui";

export const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.Event) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={() => {}}>
      {/* AlertDialog content - we'll customize it */}
      <div className="space-y-4 p-6 max-w-md">
        {error && (
          <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded alert">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="text-sm text-ink-muted">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </AlertDialog>
  );
};