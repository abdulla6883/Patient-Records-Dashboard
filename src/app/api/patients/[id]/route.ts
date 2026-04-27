import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  console.log(`PATCH /api/patients/${id} - Data received:`, JSON.stringify(data, null, 2));

  try {
    const updatePayload: any = {};
    
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.gender !== undefined) updatePayload.gender = data.gender;
    if (data.age !== undefined) {
      const parsedAge = parseInt(data.age.toString());
      if (!isNaN(parsedAge)) {
        updatePayload.age = parsedAge;
      }
    }
    if (data.profilePicture !== undefined) updatePayload.profilePicture = data.profilePicture;
    if (data.dateOfBirth !== undefined) updatePayload.dateOfBirth = data.dateOfBirth;
    if (data.phoneNumber !== undefined) updatePayload.phoneNumber = data.phoneNumber;
    if (data.emergencyContact !== undefined) updatePayload.emergencyContact = data.emergencyContact;
    if (data.insuranceType !== undefined) updatePayload.insuranceType = data.insuranceType;

    // Relations handling
    if (data.diagnosisHistory) {
      updatePayload.diagnosisHistory = {
        deleteMany: {},
        create: data.diagnosisHistory.map((h: any) => ({
          month: h.month || 'March',
          year: parseInt(h.year?.toString() || '2024'),
          systolicValue: parseInt(h.systolicValue?.toString() || '120'),
          systolicLevel: h.systolicLevel || 'Normal',
          diastolicValue: parseInt(h.diastolicValue?.toString() || '80'),
          diastolicLevel: h.diastolicLevel || 'Normal',
          heartRateValue: parseInt(h.heartRateValue?.toString() || '72'),
          heartRateLevel: h.heartRateLevel || 'Normal',
          respiratoryValue: parseInt(h.respiratoryValue?.toString() || '16'),
          respiratoryLevel: h.respiratoryLevel || 'Normal',
          temperatureValue: parseFloat(h.temperatureValue?.toString() || '98.6'),
          temperatureLevel: h.temperatureLevel || 'Normal',
        }))
      };
    }

    if (data.diagnosticList) {
      updatePayload.diagnosticList = {
        deleteMany: {},
        create: data.diagnosticList.map((d: any) => ({
          name: d.name,
          description: d.description || 'N/A',
          status: d.status || 'Active'
        }))
      };
    }

    if (data.labResults) {
      updatePayload.labResults = {
        deleteMany: {},
        create: data.labResults.map((name: string) => ({ name }))
      };
    }

    console.log(`PATCH /api/patients/${id} - Final Update Payload:`, JSON.stringify(updatePayload, null, 2));

    const updated = await prisma.patient.update({
      where: { id },
      data: updatePayload,
      include: {
        diagnosisHistory: true,
        diagnosticList: true,
        labResults: true,
      }
    });

    console.log(`PATCH /api/patients/${id} - Successfully updated. Patient name: ${updated.name}`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ 
      error: "Failed to update patient", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  console.log(`DELETE /api/patients/${id} - Requested by ${session.user?.email}`);

  if (!id) {
    return NextResponse.json({ error: "Missing patient ID" }, { status: 400 });
  }

  try {
    // Verify patient exists before trying to delete
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        diagnosisHistory: true,
        diagnosticList: true,
        labResults: true,
      }
    });

    if (!patient) {
      console.warn(`DELETE /api/patients/${id} - Patient not found in database`);
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    console.log(`DELETE /api/patients/${id} - Deleting patient: ${patient.name}`);
    
    await prisma.$transaction([
      prisma.diagnosisHistory.deleteMany({ where: { patientId: id } }),
      prisma.diagnosticItem.deleteMany({ where: { patientId: id } }),
      prisma.labResult.deleteMany({ where: { patientId: id } }),
      prisma.patient.delete({ where: { id } })
    ]);
    
    console.log(`DELETE /api/patients/${id} - Successfully deleted patient and all relations`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/patients/${id} - Error:`, error);
    return NextResponse.json({ 
      error: "Failed to delete patient", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
