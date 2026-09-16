import "server-only";
import { Resend } from "resend";
import { formatDual } from "./dates";

/**
 * Bilingual acknowledgements.
 *
 * Every message is sent in the language the visitor used, and every line comes
 * from the approved copy — the templates below only arrange strings, they never
 * author them.
 *
 * When Resend is not configured the send is skipped and logged. A missing API
 * key must never lose a submission: storage has already succeeded by the time
 * this runs.
 */
export type AckInput = {
  to: string;
  locale: "en" | "ar";
  name: string;
  /** Noun phrase for this mode, from join.typeNoun.*. */
  typeNoun: string;
  responseTime: string;
  strings: {
    subject: string;
    greeting: string;
    body: string;
    dateLine: string;
    next: string;
    signoff: string;
    contactLine: string;
    founded: string;
  };
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Plain, typographic HTML. No images, no tracking pixel, no remote fonts. */
function renderAck(input: AckInput): { html: string; text: string } {
  const dir = input.locale === "ar" ? "rtl" : "ltr";
  const s = input.strings;

  const lines = [s.greeting, s.body, s.dateLine, s.next, s.signoff, s.contactLine, s.founded];
  const text = lines.join("\n\n");

  const html = `<!doctype html>
<html lang="${input.locale}" dir="${dir}">
  <body style="margin:0;padding:32px;background:#F5F1E8;color:#16191A;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.7;">
    <div style="max-width:560px;margin:0 auto;background:#FBF9F4;border:1px solid #E6E0D3;padding:32px;">
      <p style="margin:0 0 24px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5B605C;">
        ${escapeHtml(s.founded)}
      </p>
      <p style="margin:0 0 16px;">${escapeHtml(s.greeting)}</p>
      <p style="margin:0 0 16px;font-size:18px;">${escapeHtml(s.body)}</p>
      <p style="margin:0 0 24px;color:#5B605C;font-size:14px;">${escapeHtml(s.dateLine)}</p>
      <hr style="border:0;border-top:1px solid #E6E0D3;margin:24px 0;" />
      <p style="margin:0 0 16px;">${escapeHtml(s.next)}</p>
      <p style="margin:24px 0 4px;">${escapeHtml(s.signoff)}</p>
      <p style="margin:0;color:#5B605C;">${escapeHtml(s.contactLine)}</p>
    </div>
  </body>
</html>`;

  return { html, text };
}

export async function sendAcknowledgement(input: AckInput): Promise<{ sent: boolean; reason?: string }> {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "email not configured" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { html, text } = renderAck(input);

    await resend.emails.send({
      from: process.env.NOTIFY_EMAIL!,
      to: input.to,
      subject: input.strings.subject,
      html,
      text,
      replyTo: process.env.CONTACT_EMAIL || undefined,
    });
    return { sent: true };
  } catch (error) {
    // The submission is already stored; a failed email must not fail the action.
    console.error("acknowledgement email failed", error);
    return { sent: false, reason: "send failed" };
  }
}

/** Notifies the owner that something arrived. Contains no applicant detail beyond mode and locale. */
export async function notifyOwner(mode: string, locale: string, receivedAt: Date): Promise<void> {
  if (!isEmailConfigured()) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { gregorian, hijri } = formatDual(receivedAt, locale === "ar" ? "ar" : "en");
    await resend.emails.send({
      from: process.env.NOTIFY_EMAIL!,
      to: process.env.NOTIFY_EMAIL!,
      subject: `New ${mode} submission (${locale})`,
      text: `A new ${mode} submission arrived on ${gregorian} · ${hijri}.\n\nOpen /admin to read it.`,
    });
  } catch (error) {
    console.error("owner notification failed", error);
  }
}
