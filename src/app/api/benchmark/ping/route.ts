import { NextRequest, NextResponse } from "next/server";
import { guard, noStoreHeaders } from "@/lib/guard";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const denied = guard(req, 500); if (denied) return denied;
  return NextResponse.json({ ok: true, at: Date.now() }, { headers: noStoreHeaders });
}
