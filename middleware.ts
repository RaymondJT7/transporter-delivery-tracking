import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  const { pathname } = request.nextUrl;

  // Protect Admin
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Driver
  if (pathname.startsWith("/driver")) {
    if (!session || session.role !== "DRIVER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Customer
  if (pathname.startsWith("/track")) {
    if (!session || session.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*", "/track/:path*"],
};