import { NextRequest, NextResponse } from "next/server";
import { performance } from "node:perf_hooks";
import { guard, noStoreHeaders } from "@/lib/guard";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
let busy = false;
export async function POST(req: NextRequest) {
  const denied = guard(req, 8); if (denied) return denied;
  if (busy) return NextResponse.json({ error: "CPU benchmark already running" }, { status: 429 });
  let body: { durationMs?: unknown } = {};
  try { body = await req.json(); } catch { /* default duration */ }
  const durationMs = Number(body.durationMs ?? 250);
  if (![100, 250, 500].includes(durationMs))
    return NextResponse.json({ error: "durationMs must be 100, 250, or 500" }, { status: 400 });
  busy = true;
  try {
    const started = performance.now(); let operations = 0; let accumulator = 0;
    while (performance.now() - started < durationMs) {
      for (let i = 1; i <= 512; i++) accumulator += Math.sqrt(i + (operations % 997));
      operations += 512;
    }
    const elapsedMs = performance.now() - started;
    return NextResponse.json({ durationRequestedMs: durationMs, elapsedMs: +elapsedMs.toFixed(2),
      operations, operationsPerSecond: Math.round(operations / elapsedMs * 1000),
      checksum: +accumulator.toFixed(2), note: "Synthetic CPU score, not CPU model or dedicated core count."
    }, { headers: noStoreHeaders });
  } finally { busy = false; }
}
