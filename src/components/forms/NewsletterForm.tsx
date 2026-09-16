"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { subscribe } from "@/app/actions/newsletter";

/**
 * Double opt-in signup.
 *
 * One field and one button. No pre-ticked consent, because subscribing IS the
 * consent and nothing arrives until the emailed link is clicked. The success
 * message says exactly what happens next rather than implying it is finished.
 */
export function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations("newsletter");
  const tf = useTranslations("footer");
  const tj = useTranslations("join");

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    setState("sending");
    const result = await subscribe({ email, locale, website });
    setState(result.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <p className="newsletter__done" role="status">
        {t("checkInbox")}
      </p>
    );
  }

  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate>
      <label className="newsletter__label" htmlFor="newsletter-email">
        {tf("newsletter")}
      </label>
      <div className="newsletter__row">
        <input
          id="newsletter-email"
          className="field__input"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="newsletter-note"
        />
        <button type="submit" className="btn btn--quiet btn--sm" disabled={state === "sending"}>
          {state === "sending" ? tj("submitting") : t("submit")}
        </button>
      </div>

      {/* Honeypot, as on the join form. */}
      <div aria-hidden="true" className="honeypot">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <p className="newsletter__note" id="newsletter-note">
        {tf("newsletterNote")}
      </p>

      {state === "error" && (
        <p className="field__error" role="alert">
          {tj("errors.generic")}
        </p>
      )}
    </form>
  );
}
