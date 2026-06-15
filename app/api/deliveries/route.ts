import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const delivery = await prisma.delivery.create({
      data: {
        senderName: body.senderName,
        senderPhone: body.senderPhone,
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        pickupAddress: body.pickupAddress,
        deliveryAddress: body.deliveryAddress,
        packageDetails: body.packageDetails,
      },
    });

    return NextResponse.json(delivery, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create delivery" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const deliveries =
      await prisma.delivery.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(deliveries);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch deliveries" },
      { status: 500 }
    );
  }
}