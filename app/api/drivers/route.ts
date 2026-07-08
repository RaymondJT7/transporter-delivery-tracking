import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drivers = await prisma.user.findMany({
      where: {
        role: "DRIVER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(drivers);
  } catch (error) {
    console.error("Drivers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}