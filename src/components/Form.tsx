import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * Form primitives — the design-system gap closed 12 September 2026 (workstream D,
 * item 1). Ported from the "Form controls" proposal in docs/design-system.html.
 *
 * One deliberate deviation from that mockup: its success state used a green
 * (#1c7c4a), which breaks The Single Voice Rule (DESIGN.md) — this system has
 * exactly one chromatic color. `FieldOk` below uses neutral Ink-soft with a
 * check icon instead, so "saved" reads without a second hue.
 *
 * Server components throughout — nothing here needs client-side JS to render
 * or to be legible; wire up `useState`/`onSubmit` at the call site.
 */

export function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-[0.8125rem] font-semibold text-ink">
      {children}
    </label>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>;
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} role="alert" className="flex items-center gap-1.5 text-xs text-red-text">
      <ErrorIcon />
      {children}
    </span>
  );
}

/** Neutral, not green — see file header. */
export function FieldOk({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-ink-soft">
      <CheckIcon />
      {children}
    </span>
  );
}

const inputBase =
  "w-full rounded-xl border border-line bg-white px-3.5 py-3 font-sans text-[0.9375rem] text-ink placeholder:text-muted transition-colors hover:border-ink/30 focus:border-red focus:outline-none focus:ring-[3px] focus:ring-red/14";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export function TextInput({ invalid, className = "", ...props }: InputProps) {
  return (
    <input
      className={`${inputBase} ${invalid ? "border-red" : ""} ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ invalid, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`${inputBase} min-h-[104px] resize-y ${invalid ? "border-red" : ""} ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select className={`${inputBase} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
      <span className="relative mt-0.5 h-[18px] w-[18px] shrink-0">
        <input
          type="checkbox"
          className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-md border border-line bg-white transition-colors hover:border-ink/35 checked:border-red checked:bg-red"
          {...props}
        />
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100"
        >
          <path
            d="M1 4.5L3.2 6.8L8 1.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </label>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6.5L4.5 9L10 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 3.5V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
