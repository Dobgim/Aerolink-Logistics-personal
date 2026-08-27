"use client";

import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const CONTROL =
  "w-full rounded-xl border bg-white text-ink-900 placeholder:text-ink-400 " +
  "transition-colors duration-150 " +
  "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 " +
  "disabled:bg-ink-50 disabled:text-ink-400";

function tone(invalid?: boolean) {
  return invalid
    ? "border-red-400 focus-visible:outline-red-500"
    : "border-ink-300 hover:border-ink-400";
}

interface WrapProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

function Wrap({ label, hint, error, required, htmlFor, children, className }: WrapProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-700">
          {label}
          {required ? (
            <span className="ml-0.5 text-accent-600" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium text-red-600"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
  leading?: ReactNode;
}

export function Input({
  label,
  hint,
  error,
  wrapperClassName,
  leading,
  className,
  id,
  required,
  ...rest
}: InputProps) {
  const generated = useId();
  const fieldId = id ?? generated;

  return (
    <Wrap
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fieldId}
      className={wrapperClassName}
    >
      <div className="relative">
        {leading ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          >
            {leading}
          </span>
        ) : null}
        <input
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={cn(
            CONTROL,
            tone(Boolean(error)),
            "h-11 px-3.5 text-base sm:text-[0.9375rem]",
            leading && "pl-10",
            className,
          )}
          {...rest}
        />
      </div>
    </Wrap>
  );
}

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  id,
  required,
  rows = 5,
  ...rest
}: TextareaProps) {
  const generated = useId();
  const fieldId = id ?? generated;

  return (
    <Wrap
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fieldId}
      className={wrapperClassName}
    >
      <textarea
        id={fieldId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(CONTROL, tone(Boolean(error)), "resize-y px-3.5 py-3 text-base sm:text-[0.9375rem]", className)}
        {...rest}
      />
    </Wrap>
  );
}

interface SelectProps extends ComponentProps<"select"> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export function Select({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  id,
  required,
  children,
  ...rest
}: SelectProps) {
  const generated = useId();
  const fieldId = id ?? generated;

  return (
    <Wrap
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fieldId}
      className={wrapperClassName}
    >
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(
          CONTROL,
          tone(Boolean(error)),
          "h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236a7688%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:18px] bg-[right_0.75rem_center] bg-no-repeat pl-3.5 pr-10 text-base sm:text-[0.9375rem]",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </Wrap>
  );
}
