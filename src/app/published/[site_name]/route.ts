import { NextRequest, NextResponse } from "next/server";
export async function GET(_request: NextRequest, { params }: { params: Promise<{ site_name: string }> }) {
  const { site_name } = await params;
  const raw = process.env.GUTEN_PUBLIC_DOMAIN_MAP;
  if (raw) {
    let domains: Record<string, string>;
    try { domains = JSON.parse(raw); }
    catch { return new NextResponse("Invalid domain configuration", { status: 503 }); }
    const origin = Object.prototype.hasOwnProperty.call(domains, site_name) ? domains[site_name] : undefined;
    if (!origin) return new NextResponse("No public domain configured for this site", { status: 404 });
    return NextResponse.redirect(new URL("/", origin));
  }
  const base = (process.env.NEXT_PUBLIC_GUTEN_SITES_URL || "http://localhost:3000").replace(/\/$/, "");
  return NextResponse.redirect(`${base}/${encodeURIComponent(site_name)}`);
}
