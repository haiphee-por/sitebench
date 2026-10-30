import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Site Benchmark | Hosting Performance", description: "Safe server-side diagnostic dashboard for hosting benchmarks" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="th"><body>{children}</body></html>; }
