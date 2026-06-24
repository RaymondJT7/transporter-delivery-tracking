import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

        // new fields
        packageType: body.packageType || "Parcel", // default if not provided
        weight: body.weight ? parseFloat(body.weight) : null,
        driverNotes: body.driverNotes || null,

        // handle status and userId
        status: "PENDING", // default until payment
        userId: body.userId || null, // optional if you don’t have auth yet
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

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: { createdAt: "desc" },
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
