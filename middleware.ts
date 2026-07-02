import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("userRole")?.value;

  const { pathname } = request.nextUrl;

  // Protect Admin
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Driver
  if (pathname.startsWith("/driver")) {
    if (role !== "DRIVER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Customer
  if (pathname.startsWith("/track")) {
    if (role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/driver/:path*",
    "/track/:path*",
  ],
};