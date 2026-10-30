import { NextRequest, NextResponse } from "next/server";

// Per-instance limiter; also protect public deployments at the CDN/WAF.
const hits = new Map<string, { count: number; reset: number }>();
export function guard(request: NextRequest, maxPerMinute = 60): NextResponse | null {
  const configuredKey = process.env.BENCHMARK_API_KEY;
  if (configuredKey && request.headers.get("x-benchmark-key") !== configuredKey)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "anonymous";
  const id = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  if (hits.size > 10000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  const old = hits.get(id);
  const next = !old || old.reset <= now ? { count: 1, reset: now + 60_000 } : { count: old.count + 1, reset: old.reset };
  hits.set(id, next);
  if (next.count > maxPerMinute)
    return NextResponse.json({ error: "Rate limit reached" }, { status: 429, headers: { "Retry-After": "60" } });
  return null;
}
export const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };
