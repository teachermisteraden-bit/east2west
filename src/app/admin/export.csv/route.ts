import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin-auth";
import { listSubmissions, toCsv } from "@/lib/submissions";

const COLUMNS = [
  "created_at",
  "mode",
  "locale",
  "status",
  "campaign",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "ref",
  "referral_code",
  "consent_at",
  "payload",
];

/** The owner's own data, on request. Never reachable without a session. */
export async function GET() {
  if (!(await isSignedIn())) {
    return new NextResponse("Not found", { status: 404 });
  }

  const rows = await listSubmissions({}, 5000);
  const csv = toCsv(rows as unknown as Record<string, unknown>[], COLUMNS);
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="east-to-west-submissions-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
