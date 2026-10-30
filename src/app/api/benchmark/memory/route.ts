import { NextRequest, NextResponse } from "next/server";
import { guard, noStoreHeaders } from "@/lib/guard";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const denied = guard(req, 30); if (denied) return denied;
  const m = process.memoryUsage();
  return NextResponse.json({ rssMB: +(m.rss / 1048576).toFixed(2), heapUsedMB: +(m.heapUsed / 1048576).toFixed(2),
    heapTotalMB: +(m.heapTotal / 1048576).toFixed(2), externalMB: +(m.external / 1048576).toFixed(2),
    memoryLimitMB: null, note: "Process usage only. Memory allocation limit unavailable." }, { headers: noStoreHeaders });
}
