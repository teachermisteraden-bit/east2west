import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/admin-auth";
import { listOpportunities } from "@/lib/submissions";
import { addOpportunity } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

const KINDS = ["job", "contract", "referral", "startup"] as const;

/**
 * Opportunities created — the north star.
 *
 * Deliberately entered by hand. A job offer happens in a room, not in a browser,
 * so this number cannot be derived from traffic and should never be replaced by
 * a proxy for clicks. It is the one figure the society is actually judged on,
 * and it stays honest by being typed in by someone who knows it happened.
 */
export default async function OpportunitiesPage() {
  if (!(await isSignedIn())) redirect("/admin/login");

  const rows = await listOpportunities();
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.kind, (counts.get(row.kind) ?? 0) + 1);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="admin__head">
        <h1>Opportunities created</h1>
      </div>

      <section className="admin__northstar">
        <div className="admin__figure">
          <span className="admin__figurenum">{rows.length}</span>
          <span className="admin__figurelabel">total</span>
        </div>
        {KINDS.map((kind) => (
          <div className="admin__figure" key={kind}>
            <span className="admin__figurenum">{counts.get(kind) ?? 0}</span>
            <span className="admin__figurelabel">{kind}s</span>
          </div>
        ))}
      </section>

      <form action={addOpportunity} className="admin__form">
        <h2>Record one</h2>
        <div className="admin__formrow">
          <label>
            <span className="field__label">Kind</span>
            <select name="kind" className="field__input" required>
              {KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="field__label">When</span>
            <input type="date" name="occurred_on" className="field__input" defaultValue={today} required />
          </label>
          <label className="admin__formnote">
            <span className="field__label">Note (optional)</span>
            <input type="text" name="note" className="field__input" maxLength={500} />
          </label>
        </div>
        <button type="submit" className="btn btn--primary">
          Record
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="admin__empty">Nothing recorded yet. This stays at zero until something real happens.</p>
      ) : (
        <div className="admin__tablewrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>When</th>
                <th>Kind</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.occurred_on}</td>
                  <td>{row.kind}</td>
                  <td>{row.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
