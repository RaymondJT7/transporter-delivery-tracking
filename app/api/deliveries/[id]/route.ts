import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        user: true,
        assignedDriver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    
   const deliveries = await prisma.delivery.findMany({
  include: {
    assignedDriver: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    statusHistory: {
      orderBy: {
        createdAt: "desc",
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});     
        

    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(delivery, { status: 200 });
  } catch (error) {
    console.error("Get delivery error:", error);

    return NextResponse.json(
      { error: "Failed to fetch delivery" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "PENDING",
      "ASSIGNED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid delivery status" },
        { status: 400 }
      );
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: { status },
    });

    await prisma.deliveryStatusHistory.create({
      data: {
        deliveryId: id,
        status,
      },
    });

    return NextResponse.json(updatedDelivery, { status: 200 });
  } catch (error) {
    console.error("Update delivery error:", error);

    return NextResponse.json(
      { error: "Failed to update delivery" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.delivery.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Delivery deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete delivery error:", error);

    return NextResponse.json(
      { error: "Failed to delete delivery" },
      { status: 500 }
    );
  }
}