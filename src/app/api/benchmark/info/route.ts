import { NextRequest, NextResponse } from "next/server";
import os from "node:os";
import { guard, noStoreHeaders } from "@/lib/guard";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const denied = guard(req, 30); if (denied) return denied;
  const memory = process.memoryUsage();
  return NextResponse.json({
    timestamp: new Date().toISOString(), runtime: "Node.js", nodeVersion: process.version,
    platform: process.platform, architecture: process.arch,
    visibleCpus: os.availableParallelism?.() ?? os.cpus().length,
    processMemoryMB: {
      rss: +(memory.rss / 1048576).toFixed(2),
      heapUsed: +(memory.heapUsed / 1048576).toFixed(2),
      heapTotal: +(memory.heapTotal / 1048576).toFixed(2)
    },
    physicalCpuModel: "Unavailable (not a dedicated CPU specification)",
    allocatedCpuQuota: null, allocatedMemoryLimitMB: null,
    note: "Visible CPUs and process memory are runtime observations, NOT dedicated CPU/RAM allocation."
  }, { headers: noStoreHeaders });
}
