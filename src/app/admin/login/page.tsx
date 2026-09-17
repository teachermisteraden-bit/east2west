"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/actions/admin";

const MESSAGES: Record<NonNullable<LoginState["error"]>, string> = {
  wrong: "That password is not right.",
  "rate-limit": "Too many attempts. Please wait a few minutes and try again.",
  unconfigured: "ADMIN_PASSWORD is not set, so the admin area cannot be opened yet.",
};

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <div className="admin__login">
      <h1>Sign in</h1>
      <form action={action}>
        <label className="field__label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field__input"
        />
        {state.error && (
          <p className="field__error" role="alert">
            {MESSAGES[state.error]}
          </p>
        )}
        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="admin__note">
        This gate is a single shared password. Before real applications arrive, move it to Supabase Auth
        with an email allowlist — see docs/decisions.md.
      </p>
    </div>
  );
}
