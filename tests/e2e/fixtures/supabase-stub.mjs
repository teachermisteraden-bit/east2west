/**
 * A stand-in for Supabase's REST API, so end-to-end tests can exercise the real
 * submission path — server action, supabase-js, payload shape and all — without
 * a live project and without adding test-only branches to production code.
 *
 * It records what it receives at /__stub/received so tests can assert on the
 * stored row: that consent was recorded, that the honeypot never reaches the
 * database, and that campaign attribution is carried through.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.STUB_PORT ?? 4999);
const received = [];

const send = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-range": "0-0/1",
    "access-control-allow-origin": "*",
  });
  res.end(payload);
};

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/__stub/received") return send(res, 200, received);
  if (url.pathname === "/__stub/reset") {
    received.length = 0;
    return send(res, 200, { ok: true });
  }

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    let body = null;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      body = raw;
    }

    // The rate limiter's stored procedure.
    if (url.pathname.endsWith("/rpc/bump_rate_limit")) {
      return send(res, 200, { count: 1 });
    }

    // Table inserts.
    if (url.pathname.includes("/rest/v1/")) {
      const table = url.pathname.split("/rest/v1/")[1]?.split("?")[0] ?? "unknown";
      if (req.method === "POST") {
        received.push({ table, body });
        return send(res, 201, Array.isArray(body) ? body : [body]);
      }
      if (req.method === "PATCH") {
        received.push({ table, body, patch: true });
        return send(res, 200, [body]);
      }
      // Lookups (newsletter confirmation) find nothing by default.
      return send(res, 200, []);
    }

    send(res, 404, { error: "not found" });
  });
}).listen(PORT, () => {
  console.log(`supabase stub listening on ${PORT}`);
});
