import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deliveries = await prisma.delivery.findMany({
      where: {
        assignedDriverId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Driver deliveries error:", error);

    return NextResponse.json(
      { error: "Failed to fetch driver deliveries" },
      { status: 500 }
    );
  }
}