import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/admin-auth";
import { isStorageConfigured } from "@/lib/supabase";
import { listSubmissions, countBy, type SubmissionRow } from "@/lib/submissions";
import { formatDual } from "@/lib/dates";
import { MODES } from "@/lib/form-steps";
import { site } from "@/config/site";
import { StatusPicker } from "./StatusPicker";
import { SignOutButton } from "./SignOutButton";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ mode?: string; campaign?: string; status?: string }> };

/** The applicant's own name, wherever the mode happens to keep it. */
function nameOf(row: SubmissionRow): string {
  const payload = row.payload ?? {};
  return String(payload.fullName ?? payload.contactName ?? "—");
}

function orgOf(row: SubmissionRow): string {
  const payload = row.payload ?? {};
  return String(payload.company ?? payload.institution ?? payload.university ?? payload.chapterCity ?? "—");
}

export default async function AdminPage({ searchParams }: Props) {
  if (!(await isSignedIn())) redirect("/admin/login");

  const filter = await searchParams;
  const rows = await listSubmissions(filter);

  const byMode = countBy(rows, (r) => r.mode);
  const byCampaign = countBy(rows, (r) => r.campaign);
  const byStatus = countBy(rows, (r) => r.status);

  const link = (params: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...filter, ...params })) if (v) search.set(k, v);
    const query = search.toString();
    return query ? `/admin?${query}` : "/admin";
  };

  return (
    <>
      <div className="admin__head">
        <h1>Submissions</h1>
        <SignOutButton />
      </div>

      {!isStorageConfigured() && (
        <p className="admin__warn">
          Supabase is not configured, so nothing can be read or stored. Set NEXT_PUBLIC_SUPABASE_URL and
          SUPABASE_SERVICE_ROLE_KEY.
        </p>
      )}

      <section className="admin__summaries">
        <div>
          <h2>By form</h2>
          <ul>
            <li>
              <a href={link({ mode: undefined })}>All</a> <span>{rows.length}</span>
            </li>
            {MODES.map((mode) => (
              <li key={mode}>
                <a href={link({ mode })}>{mode}</a> <span>{byMode.get(mode) ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>By campaign</h2>
          <ul>
            <li>
              <a href={link({ campaign: undefined })}>All</a> <span>{rows.length}</span>
            </li>
            {site.campaigns.map((campaign) => (
              <li key={campaign}>
                <a href={link({ campaign })}>{campaign}</a> <span>{byCampaign.get(campaign) ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>By status</h2>
          <ul>
            <li>
              <a href={link({ status: undefined })}>All</a> <span>{rows.length}</span>
            </li>
            {["new", "contacted", "accepted", "declined"].map((status) => (
              <li key={status}>
                <a href={link({ status })}>{status}</a> <span>{byStatus.get(status) ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {rows.length === 0 ? (
        <p className="admin__empty">No submissions yet.</p>
      ) : (
        <div className="admin__tablewrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Form</th>
                <th>Name</th>
                <th>Organisation</th>
                <th>Email</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const { gregorian, hijri } = formatDual(new Date(row.created_at), row.locale === "ar" ? "ar" : "en");
                return (
                  <tr key={row.id}>
                    <td>
                      <span className="admin__date">{gregorian}</span>
                      <span className="admin__sub">{hijri}</span>
                    </td>
                    <td>
                      {row.mode}
                      <span className="admin__sub">{row.locale}</span>
                    </td>
                    <td>{nameOf(row)}</td>
                    <td>{orgOf(row)}</td>
                    <td>
                      <a href={`mailto:${String(row.payload?.email ?? "")}`}>{String(row.payload?.email ?? "—")}</a>
                    </td>
                    <td>
                      {row.campaign ?? "—"}
                      {row.utm_campaign && <span className="admin__sub">{row.utm_campaign}</span>}
                      {row.ref && <span className="admin__sub">ref: {row.ref}</span>}
                    </td>
                    <td>
                      <StatusPicker id={row.id} status={row.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
