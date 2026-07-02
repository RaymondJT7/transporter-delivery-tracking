import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalDeliveries,
      pending,
      pickedUp,
      inTransit,
      delivered,
      cancelled,
      customers,
      drivers,
      admins,
      recentDeliveries,
    ] = await Promise.all([
      prisma.delivery.count(),
      prisma.delivery.count({ where: { status: "PENDING" } }),
      prisma.delivery.count({ where: { status: "PICKED_UP" } }),
      prisma.delivery.count({ where: { status: "IN_TRANSIT" } }),
      prisma.delivery.count({ where: { status: "DELIVERED" } }),
      prisma.delivery.count({ where: { status: "CANCELLED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "DRIVER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.delivery.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalDeliveries,
        pending,
        pickedUp,
        inTransit,
        delivered,
        cancelled,
      },
      users: {
        customers,
        drivers,
        admins,
      },
      recentDeliveries,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return NextResponse.json(
      { error: "Failed to load admin dashboard" },
      { status: 500 }
    );
  }
}