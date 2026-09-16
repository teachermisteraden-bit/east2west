"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useTranslations } from "next-intl";

import { ruleFor } from "@/lib/field-rules";
import {
  formSteps,
  totalNodes,
  fieldOptions,
  optionLabelSource,
  optionValues,
  optionalFields,
  multiFields,
  choiceFields,
  textAreaFields,
  type Mode,
} from "@/lib/form-steps";
import { readTracking } from "@/lib/tracking";
import { submitJoin, type SubmitResult } from "@/app/actions/submit";
import { ProgressThread } from "./ProgressThread";
import { TextField, TextArea, ChoiceGroup, CheckField, Honeypot } from "./Fields";
import { InvitationCard } from "./InvitationCard";

const AUTOCOMPLETE: Record<string, string> = {
  fullName: "name",
  contactName: "name",
  email: "email",
  mobile: "tel",
  phone: "tel",
  city: "address-level2",
  nationality: "country-name",
  company: "organization",
  institution: "organization",
  role: "organization-title",
  linkedin: "url",
};

const INPUT_MODE: Record<string, "text" | "email" | "tel" | "numeric" | "url"> = {
  email: "email",
  mobile: "tel",
  phone: "tel",
  graduationYear: "numeric",
  linkedin: "url",
};

export function JoinForm({
  mode,
  locale,
  responseTime,
  typeNoun,
}: {
  mode: Mode;
  locale: string;
  /** Resolved on the server: these come from env, which the browser cannot read. */
  responseTime: string;
  typeNoun: string;
}) {
  const t = useTranslations("join");
  const tc = useTranslations("common");
  const tconf = useTranslations("confirmation");
  const tp = useTranslations("programmes");

  const steps = formSteps[mode];
  const total = totalNodes(mode);

  // Node 1 is the mode choice, already made. Field steps run from node 2.
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const draftKey = `e2w-draft-${mode}`;

  const form = useForm<FieldValues>({
    mode: "onBlur",
    defaultValues: { mode, locale, website: "" },
  });

  // Restore an unfinished application. sessionStorage, not localStorage: the
  // draft lasts as long as the tab, and never outlives the visit.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(draftKey);
      if (saved) {
        const values = JSON.parse(saved) as FieldValues;
        // Consent is never restored — it must be given deliberately, each time.
        delete values.consent;
        form.reset({ ...values, mode, locale, website: "" });
      }
    } catch {
      // Storage unavailable: the form simply starts empty.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        const { consent: _c, website: _w, ...rest } = values as FieldValues;
        sessionStorage.setItem(draftKey, JSON.stringify(rest));
      } catch {
        // Storage unavailable: drafts are simply not kept.
      }
    });
    return () => subscription.unsubscribe();
  }, [form, draftKey]);

  // Attribution is captured at mount, so it survives the visitor browsing first.
  useEffect(() => {
    const tracking = readTracking();
    for (const [key, value] of Object.entries(tracking)) {
      if (value) form.setValue(key, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function next() {
    const fields = steps[stepIndex] ?? [];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    headingRef.current?.focus();
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
    headingRef.current?.focus();
  }

  async function onSubmit(values: FieldValues) {
    setSubmitting(true);
    setFormError(null);
    try {
      const response = await submitJoin(values);
      if (response.ok) {
        try {
          sessionStorage.removeItem(draftKey);
        } catch {
          // Nothing to clean up.
        }
        setResult(response);
      } else if (response.error === "validation" && response.fieldErrors) {
        for (const [field, message] of Object.entries(response.fieldErrors)) {
          form.setError(field, { message });
        }
        setFormError(t("errors.generic"));
      } else {
        setFormError(t("errors.generic"));
      }
    } catch {
      setFormError(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  // The end moment (peak-end, 02): the invitation card replaces the form.
  if (result?.ok) {
    return (
      <InvitationCard
        name={result.name}
        gregorian={result.gregorian}
        hijri={result.hijri}
        inviteUrl={result.inviteUrl}
        total={total}
        responseTime={responseTime}
        typeNoun={typeNoun}
      />
    );
  }

  const isLastStep = stepIndex === steps.length - 1;
  const currentNode = stepIndex + 2;
  const errors = form.formState.errors;

  const errorFor = (field: string): string | undefined => {
    const message = errors[field]?.message;
    if (typeof message !== "string") return undefined;
    // The schemas emit message KEYS, and tests/schemas.test.mjs enforces it.
    // If one ever slips through as raw prose, show the kind generic message
    // rather than printing a key path at the visitor.
    return t.has(`errors.${message}`) ? t(`errors.${message}`) : t("errors.generic");
  };

  return (
    <div className="joinform">
      <ProgressThread
        current={currentNode}
        total={total}
        progressLabel={t("progress", { current: currentNode, total })}
        startedLabel={t("started")}
        lastStepLabel={t("lastStep")}
        completedLabel={tconf("journeyJoined")}
        nodeLabel={(n, of) => t("progress", { current: n, total: of })}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <h2 className="joinform__heading" tabIndex={-1} ref={headingRef}>
          {t(`modes.${mode}`)}
        </h2>

        <div className="joinform__fields">
          {(steps[stepIndex] ?? []).map((field) => {
            const label = t(`fields.${field}`);
            const optional = optionalFields.has(field);
            const error = errorFor(field);

            if (field === "consent") {
              return (
                <CheckField
                  key={field}
                  id={field}
                  label={t("fields.consent")}
                  error={error}
                  registration={form.register("consent", ruleFor("consent"))}
                />
              );
            }

            if (field === "womensCircle") {
              return (
                <CheckField
                  key={field}
                  id={field}
                  label={label}
                  error={error}
                  registration={form.register(field, ruleFor(field))}
                />
              );
            }

            if (multiFields.has(field) || choiceFields.has(field)) {
              const keys = fieldOptions[field] ?? [];
              const source = optionLabelSource[field] ?? "options";

              const options = keys.map((key) => ({
                // interests stores the programme key itself; the rest map to enum values.
                value: source === "programmes" ? key : (optionValues[key] ?? key),
                label:
                  source === "programmes"
                    ? tp(`items.${key}.name`)
                    : source === "fields"
                      ? t(`fields.${key}`)
                      : t(`options.${key}`),
              }));

              return (
                <ChoiceGroup
                  key={field}
                  name={field}
                  legend={label}
                  hint={multiFields.has(field) ? t("selectAll") : undefined}
                  error={error}
                  optional={optional}
                  optionalLabel={t("optional")}
                  multiple={multiFields.has(field)}
                  options={options}
                  registration={form.register(field, ruleFor(field))}
                />
              );
            }

            if (textAreaFields.has(field)) {
              return (
                <TextArea
                  key={field}
                  id={field}
                  label={label}
                  error={error}
                  optional={optional}
                  optionalLabel={t("optional")}
                  registration={form.register(field, ruleFor(field))}
                />
              );
            }

            return (
              <TextField
                key={field}
                id={field}
                label={label}
                error={error}
                optional={optional}
                optionalLabel={t("optional")}
                type={field === "email" ? "email" : "text"}
                inputMode={INPUT_MODE[field]}
                autoComplete={AUTOCOMPLETE[field]}
                registration={form.register(field, ruleFor(field))}
              />
            );
          })}
        </div>

        <Honeypot registration={form.register("website")} />

        {formError && (
          <p className="field__error joinform__formerror" role="alert">
            {formError}
          </p>
        )}

        <div className="joinform__actions">
          {stepIndex > 0 && (
            <button type="button" className="btn btn--quiet" onClick={back}>
              {t("back")}
            </button>
          )}

          {isLastStep ? (
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? t("submitting") : t(`submit.${mode}`)}
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={next}>
              {t("next")}
            </button>
          )}
        </div>

        <p className="joinform__note">{t("draftSaved")}</p>
        <p className="invitation__reassurance">{tc("reassurance", { responseTime })}</p>
      </form>
    </div>
  );
}
