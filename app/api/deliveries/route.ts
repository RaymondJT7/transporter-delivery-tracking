import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json(
      { error: "Failed to fetch deliveries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const delivery = await prisma.delivery.create({
      data: {
        senderName: body.senderName || null,
        senderPhone: body.senderPhone || null,
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        pickupAddress: body.pickupAddress,
        deliveryAddress: body.deliveryAddress,
        packageType: body.packageType || null,
        weight: body.weight ? Number(body.weight) : null,
        driverNotes: body.driverNotes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(delivery, { status: 201 });
  } catch (error) {
    console.error("Error creating delivery:", error);
    return NextResponse.json(
      { error: "Failed to create delivery" },
      { status: 500 }
    );
  }
}