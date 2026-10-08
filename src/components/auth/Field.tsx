import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, id, className, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={
          "w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/15 dark:bg-white/5 dark:text-foreground " +
          (className ?? "")
        }
        {...rest}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
});

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}
export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, error, id, className, ...rest }, ref) {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={
            "w-full resize-none rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/15 dark:bg-white/5 dark:text-foreground " +
            (className ?? "")
          }
          {...rest}
        />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  },
);

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: React.ReactNode;
}
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, error, id, className, children, ...rest }, ref) {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        <select
          ref={ref}
          id={inputId}
          className={
            "w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/15 dark:bg-white/5 dark:text-foreground " +
            (className ?? "")
          }
          {...rest}
        >
          {children}
        </select>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  },
);

export function SubmitButton({
  children,
  loading,
  ...rest
}: { loading?: boolean } & InputHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      disabled={loading || rest.disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground shadow-sm ring-1 ring-brand transition-all hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground" />
      ) : null}
      {children as React.ReactNode}
    </button>
  );
}
