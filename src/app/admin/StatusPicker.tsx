"use client";

import { useTransition } from "react";
import { setStatus, type SubmissionStatus } from "@/app/actions/admin";

const OPTIONS: SubmissionStatus[] = ["new", "contacted", "accepted", "declined"];

/** Changing a status is one select; the server re-checks the session either way. */
export function StatusPicker({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className="admin__status"
      defaultValue={status}
      disabled={pending}
      aria-label="Status"
      onChange={(e) => {
        const next = e.target.value as SubmissionStatus;
        startTransition(() => {
          void setStatus(id, next);
        });
      }}
    >
      {OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
