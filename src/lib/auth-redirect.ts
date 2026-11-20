export function getSafeAuthRedirect(path?: string): string | null {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}
