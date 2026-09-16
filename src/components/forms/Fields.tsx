"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import type { ReactNode } from "react";

/**
 * Field primitives.
 *
 * Every field labels itself properly, marks itself required or optional in
 * words rather than only with an asterisk, and announces its own error through
 * aria-describedby and role="alert" so screen readers hear it.
 */

function Shell({
  id,
  label,
  hint,
  error,
  optional,
  optionalLabel,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  optionalLabel: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="field" data-invalid={error ? "true" : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
        {optional && <span className="field__optional"> — {optionalLabel}</span>}
      </label>
      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

export function TextField({
  id,
  label,
  error,
  hint,
  optional,
  optionalLabel,
  type = "text",
  inputMode,
  autoComplete,
  registration,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  optionalLabel: string;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "url";
  autoComplete?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional} optionalLabel={optionalLabel}>
      <input
        id={id}
        className="field__input"
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...registration}
      />
    </Shell>
  );
}

export function TextArea({
  id,
  label,
  error,
  optional,
  optionalLabel,
  registration,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  optionalLabel: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <Shell id={id} label={label} error={error} optional={optional} optionalLabel={optionalLabel}>
      <textarea
        id={id}
        className="field__input field__input--area"
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, undefined, error)}
        {...registration}
      />
    </Shell>
  );
}

/** Radio group for single choice; checkbox group for multi-select. */
export function ChoiceGroup({
  name,
  legend,
  hint,
  error,
  optionalLabel,
  optional,
  multiple,
  options,
  registration,
}: {
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  optionalLabel: string;
  optional?: boolean;
  multiple?: boolean;
  options: { value: string; label: string }[];
  registration: UseFormRegisterReturn;
}) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint ? `${name}-hint` : undefined;

  return (
    <fieldset className="field field--group" data-invalid={error ? "true" : undefined}>
      <legend className="field__label">
        {legend}
        {optional && <span className="field__optional"> — {optionalLabel}</span>}
      </legend>
      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className="choices" role={multiple ? "group" : "radiogroup"} aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}>
        {options.map((opt) => (
          <label className="choice" key={opt.value}>
            <input
              className="choice__input"
              type={multiple ? "checkbox" : "radio"}
              value={opt.value}
              aria-invalid={error ? true : undefined}
              {...registration}
            />
            <span className="choice__box" aria-hidden="true" />
            <span className="choice__label">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/**
 * A single checkbox. Used for consent and for the women's circle preference.
 * Never pre-ticked (non-negotiable 5) — `defaultChecked` is deliberately absent
 * and no caller may pass one.
 */
export function CheckField({
  id,
  label,
  error,
  note,
  registration,
}: {
  id: string;
  label: string;
  error?: string;
  note?: string;
  registration: UseFormRegisterReturn;
}) {
  const errorId = error ? `${id}-error` : undefined;
  const noteId = note ? `${id}-note` : undefined;

  return (
    <div className="field field--check" data-invalid={error ? "true" : undefined}>
      <label className="choice choice--block" htmlFor={id}>
        <input
          id={id}
          className="choice__input"
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={[noteId, errorId].filter(Boolean).join(" ") || undefined}
          {...registration}
        />
        <span className="choice__box" aria-hidden="true" />
        <span className="choice__label">{label}</span>
      </label>
      {note && (
        <p className="field__hint field__hint--indent" id={noteId}>
          {note}
        </p>
      )}
      {error && (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Honeypot. Hidden from sight and from assistive technology, skipped by the
 * keyboard, and never autofilled. A real visitor cannot fill it in; a bot will.
 */
export function Honeypot({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="honeypot">
      <label htmlFor="website">Website</label>
      <input id="website" type="text" tabIndex={-1} autoComplete="off" {...registration} />
    </div>
  );
}
