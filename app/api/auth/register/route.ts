import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Never trust a role sent from the client - anyone could POST
    // { "role": "ADMIN" } and grant themselves admin access. Public
    // self-registration can only ever create a CUSTOMER or DRIVER;
    // ADMIN accounts should be created a different way (e.g. directly
    // in the database, or a separate invite-only flow).
    const ALLOWED_SELF_SIGNUP_ROLES = ["CUSTOMER", "DRIVER"];
    const requestedRole =
      typeof role === "string" ? role.toUpperCase() : "CUSTOMER";
    const safeRole = ALLOWED_SELF_SIGNUP_ROLES.includes(requestedRole)
      ? requestedRole
      : "CUSTOMER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: safeRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}