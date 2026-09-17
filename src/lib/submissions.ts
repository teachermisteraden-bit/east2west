import "server-only";
import { getSupabase, isStorageConfigured } from "./supabase";

/** One stored application, as the admin needs to read it. */
export type SubmissionRow = {
  id: string;
  created_at: string;
  mode: string;
  locale: string;
  payload: Record<string, unknown>;
  consent_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  campaign: string | null;
  ref: string | null;
  referral_code: string | null;
  status: string;
};

export type SubmissionFilter = { mode?: string; campaign?: string; status?: string };

export async function listSubmissions(filter: SubmissionFilter = {}, limit = 200): Promise<SubmissionRow[]> {
  if (!isStorageConfigured()) return [];

  let query = getSupabase()
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filter.mode) query = query.eq("mode", filter.mode);
  if (filter.campaign) query = query.eq("campaign", filter.campaign);
  if (filter.status) query = query.eq("status", filter.status);

  const { data, error } = await query;
  if (error) {
    console.error("listing submissions failed", error.message);
    return [];
  }
  return (data ?? []) as SubmissionRow[];
}

export type Opportunity = {
  id: string;
  created_at: string;
  kind: string;
  note: string | null;
  occurred_on: string;
};

export async function listOpportunities(): Promise<Opportunity[]> {
  if (!isStorageConfigured()) return [];
  const { data, error } = await getSupabase()
    .from("opportunities")
    .select("*")
    .order("occurred_on", { ascending: false })
    .limit(500);
  if (error) {
    console.error("listing opportunities failed", error.message);
    return [];
  }
  return (data ?? []) as Opportunity[];
}

/** Counts by an arbitrary key, for the small summary tables. */
export function countBy(rows: SubmissionRow[], key: (row: SubmissionRow) => string | null): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = key(row) ?? "—";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
}

/**
 * RFC 4180 CSV.
 *
 * Every value is quoted and inner quotes doubled, so a comma, a newline or a
 * quotation mark inside an answer cannot shift the columns. A leading =, +, -
 * or @ is prefixed with a quote: spreadsheets treat those as formulas, and a
 * pasted answer should never execute in the owner's spreadsheet.
 */
export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    let text = typeof value === "object" ? JSON.stringify(value) : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };

  const header = columns.map(escape).join(",");
  const body = rows.map((row) => columns.map((c) => escape(row[c])).join(",")).join("\r\n");
  return `${header}\r\n${body}\r\n`;
}
