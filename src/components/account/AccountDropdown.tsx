import { useAuth } from "@/components/auth/UseAuth";
import { LogOut } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export const AccountDropdown = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => {}}
        className="relative flex items-center gap-2 p-2 rounded hover:bg-brand/10 transition-colors"
        aria-label="Account menu"
      >
        <LogOut className="size-4" />
      </button>

      <ul
        onClick={handleLogout}
        className="absolute right-0 mt-2 w-40 bg-background rounded-md shadow-lg p-1 z-10 min-w"
      >
        <li>
          <span className="text-sm font-medium text-ink">
            {user.name}
          </span>
        </li>
        <li className="mt-2">
          <button
            onClick={() => router.push("/account")}
            className="w-full text-left text-sm text-ink hover:text-brand"
          >
            My Account
          </button>
        </li>
        <li className="mt-2">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-600 hover:text-red-400"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};