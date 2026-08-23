import { NextRequest, NextResponse } from "next/server";

// Protects the admin dashboard pages and every write-capable API route.
// Session check is a simple cookie comparison against ADMIN_PASSWORD.
// This is deliberately lightweight (no user accounts) since there is
// exactly one editor. See SETUP.md for the security tradeoffs.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth =
    pathname.startsWith("/admin/dashboard") ||
    (pathname.startsWith("/api/cars") && request.method !== "GET") ||
    pathname.startsWith("/api/upload");

  if (!needsAuth) return NextResponse.next();

  const session = request.cookies.get("admin_session")?.value;
  const expected = process.env.ADMIN_PASSWORD;

  if (session && expected && session === expected) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/cars/:path*", "/api/upload/:path*"],
};
