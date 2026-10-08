import { Link } from "@tanstack/react-router";

type LogoProps = {
  /** Icon mark size in px. Text scales with `textClassName`. */
  size?: number;
  /** Hide the wordmark and only render the icon. */
  iconOnly?: boolean;
  /** Extra classes for the outer element. */
  className?: string;
  /** Classes applied to the "GramSetu" wordmark. */
  textClassName?: string;
  /** Wrap the logo in a Link to `/`. Defaults to true. */
  asLink?: boolean;
};

/**
 * Placeholder brand mark for GramSetu — a stylized letter "G" formed by
 * a bridge arch cradling a leaf. Enough padding around the glyph so a
 * future custom logo can drop in without any surrounding layout change.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid place-items-center rounded-xl bg-brand/10 ring-1 ring-brand/15"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 32 32"
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bridge arch forming the curve of the G */}
        <path
          d="M27 17a11 11 0 1 1-4.2-8.7"
          stroke="var(--brand)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* G's inner bar */}
        <path
          d="M17 17h9"
          stroke="var(--brand)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Bridge deck */}
        <path
          d="M6 22h20"
          stroke="var(--brand-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Leaf accent */}
        <path
          d="M22 9c-3 .4-4.6 2-4.9 4.9 3-.3 4.6-1.9 4.9-4.9Z"
          fill="var(--brand-accent)"
        />
      </svg>
    </span>
  );
}

export function Logo({
  size = 28,
  iconOnly = false,
  className = "",
  textClassName = "font-semibold tracking-tight text-brand",
  asLink = true,
}: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} />
      {!iconOnly && <span className={textClassName}>GramSetu</span>}
    </>
  );

  const base = `inline-flex items-center gap-2 ${className}`;

  if (!asLink) return <span className={base}>{content}</span>;

  return (
    <Link to="/" className={`${base} transition-opacity hover:opacity-80`}>
      {content}
    </Link>
  );
}
