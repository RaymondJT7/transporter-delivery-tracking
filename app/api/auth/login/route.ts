import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createSessionToken({ userId: user.id, role: user.role });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // httpOnly = JavaScript in the browser can't read or overwrite this,
    // unlike the old `document.cookie = "userRole=..."` approach.
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}