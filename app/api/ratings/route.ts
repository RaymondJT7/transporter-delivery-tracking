import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deliveryId = searchParams.get("deliveryId");

    if (!deliveryId) {
      return NextResponse.json({ error: "deliveryId is required" }, { status: 400 });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      select: {
        id: true,
        ratingScore: true,
        ratingTags: true,
        ratingFeedback: true,
      },
    });

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    return NextResponse.json(delivery, { status: 200 });
  } catch (error) {
    console.error("RatingCard GET error:", error);
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const deliveryId = body?.deliveryId;
    const score = Number(body?.score);
    const tags = Array.isArray(body?.tags) ? body.tags : [];
    const feedback = typeof body?.feedback === "string" ? body.feedback.trim() : null;

    if (!deliveryId || typeof deliveryId !== "string") {
      return NextResponse.json({ error: "deliveryId is required" }, { status: 400 });
    }

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return NextResponse.json({ error: "score must be between 1 and 5" }, { status: 400 });
    }

    let delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });

    if (!delivery) {
      delivery = await prisma.delivery.create({
        data: {
          id: deliveryId,
          receiverName: "Demo Receiver",
          receiverPhone: "0000000000",
          pickupAddress: "Demo Pickup",
          deliveryAddress: "Demo Delivery",
          packageType: "Parcel",
          status: "PENDING",
        },
      });
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        ratingScore: score,
        ratingTags: tags,
        ratingFeedback: feedback,
      },
    });

    return NextResponse.json(updatedDelivery, { status: 200 });
  } catch (error) {
    console.error("RatingCard POST error:", error);
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}
