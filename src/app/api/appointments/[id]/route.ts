import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// PATCH /api/appointments/[id]
export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/appointments/[id]'>
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await ctx.params;
    const data = await req.json();

    // Ensure this appointment belongs to the authenticated user
    const existing = await prisma.appointment.findFirst({
      where: { id, userId: (session.user as any)?.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        patient: data.patient ?? existing.patient,
        service: data.service ?? existing.service,
        date:    data.date    ?? existing.date,
        time:    data.time    ?? existing.time,
        status:  data.status  ?? existing.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/appointments/[id]'>
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await ctx.params;

    const existing = await prisma.appointment.findFirst({
      where: { id, userId: (session.user as any)?.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
