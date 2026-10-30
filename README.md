# SiteBench — Hosting Benchmark Dashboard

Next.js + TypeScript dashboard to measure server-side runtime performance with bounded CPU and HTTP probes.

## Features
- Runtime info: Node.js, OS, architecture, visible CPU threads, process memory
- CPU microbenchmark: bounded 100 / 250 / 500 ms
- HTTP probe: 10 / 20 / 50 requests, concurrency 3, p50/p95/p99 and requests/sec
- Export JSON and responsive dark UI
- Optional API key and per-instance request limiter

## Local run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Before public deployment configure BENCHMARK_API_KEY in your hosting environment, and enter it on the page.

## Deploy

```bash
npm run build
npm start
```

This app requires Next.js Node.js API routes. Importing a complete Next.js repository into chatgpt.site is **not confirmed**. If that platform does not permit direct import, use DEPLOY_PROMPT_TH.txt to recreate the functionality in its runtime.

### API
- GET /api/benchmark/info
- GET /api/benchmark/memory
- POST /api/benchmark/cpu with JSON {"durationMs":250}
- GET /api/benchmark/ping

Optional authentication header: X-Benchmark-Key.

**Interpretation:** visible CPU count is not allocated vCPU; process RSS is not hardware RAM. Browser-to-server load probe is affected by your own connection and does not measure maximum concurrency. In-memory locks and rate limits are per instance. Use WAF/CDN rate limiting for public exposure; do not run CPU tests against production-critical services.
