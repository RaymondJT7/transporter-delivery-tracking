import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}