import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDeliveryStatusEmail } from "@/lib/email";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
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

    const existingDelivery = await prisma.delivery.findUnique({
      where: { id },
    });

    if (!existingDelivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: {
        senderName: body.senderName ?? existingDelivery.senderName,
        senderPhone: body.senderPhone ?? existingDelivery.senderPhone,
        receiverName: body.receiverName ?? existingDelivery.receiverName,
        receiverPhone: body.receiverPhone ?? existingDelivery.receiverPhone,
        pickupAddress: body.pickupAddress ?? existingDelivery.pickupAddress,
        deliveryAddress:
          body.deliveryAddress ?? existingDelivery.deliveryAddress,
        packageType: body.packageType ?? existingDelivery.packageType,
        weight:
          body.weight !== undefined && body.weight !== ""
            ? Number(body.weight)
            : existingDelivery.weight,
        driverNotes: body.driverNotes ?? existingDelivery.driverNotes,
        status: body.status ?? existingDelivery.status,
      },
      include: {
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

    const statusChanged =
      body.status && body.status !== existingDelivery.status;

    if (statusChanged) {
      await prisma.deliveryStatusHistory.create({
        data: {
          deliveryId: id,
          status: body.status,
        },
      });

      try {
        await sendDeliveryStatusEmail({
          to: process.env.TEST_EMAIL || process.env.EMAIL_USER || "",
          receiverName: updatedDelivery.receiverName,
          trackingId: updatedDelivery.id,
          status: body.status,
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }
    }

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