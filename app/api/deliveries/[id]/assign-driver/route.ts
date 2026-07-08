import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { driverId } = await req.json();

    if (!driverId) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    const driver = await prisma.user.findUnique({
      where: { id: driverId },
    });

    if (!driver || driver.role !== "DRIVER") {
      return NextResponse.json(
        { error: "Selected user is not a driver" },
        { status: 400 }
      );
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: {
        assignedDriverId: driverId,
        status: "ASSIGNED",
      },
      include: {
        assignedDriver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDelivery);
  } catch (error) {
    console.error("Assign driver error:", error);
    return NextResponse.json(
      { error: "Failed to assign driver" },
      { status: 500 }
    );
  }
}