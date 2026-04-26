import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [patientCount, appointmentCount, latestTransactions] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.transaction.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
    ]);

    return NextResponse.json({
      patientCount,
      appointmentCount,
      latestTransactions
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
