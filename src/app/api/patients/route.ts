import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export const dynamic = 'force-dynamic';

function mapPatientToFrontend(p: any) {
  return {
    ...p,
    profile_picture: p.profilePicture,
    date_of_birth: p.dateOfBirth,
    phone_number: p.phoneNumber,
    emergency_contact: p.emergencyContact,
    insurance_type: p.insuranceType,
    diagnosis_history: (p.diagnosisHistory || []).map((dh: any) => ({
      month: dh.month,
      year: dh.year,
      blood_pressure: {
        systolic: { value: dh.systolicValue, levels: dh.systolicLevel },
        diastolic: { value: dh.diastolicValue, levels: dh.diastolicLevel },
      },
      heart_rate: { value: dh.heartRateValue, levels: dh.heartRateLevel },
      respiratory_rate: { value: dh.respiratoryValue, levels: dh.respiratoryLevel },
      temperature: { value: dh.temperatureValue, levels: dh.temperatureLevel },
    })),
    diagnostic_list: (p.diagnosticList || []).map((di: any) => ({
      name: di.name,
      description: di.description,
      status: di.status,
    })),
    lab_results: (p.labResults || []).map((lr: any) => lr.name),
  };
}

export async function GET() {
  const session = await auth();
  console.log("GET /api/patients - Session:", !!session);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  try {
    console.log("GET /api/patients - Fetching patients...");
    const patients = await prisma.patient.findMany({
      include: {
        diagnosisHistory: true,
        diagnosticList: true,
        labResults: true,
      },
    });
    const mapped = patients.map(mapPatientToFrontend);
    console.log(`GET /api/patients - Found ${mapped.length} patients`);
    return new Response(JSON.stringify(mapped), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/patients Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch patients" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    console.log("Creating patient with data:", data);
    
    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        gender: data.gender || "Female",
        age: Number(data.age) || 0,
        profilePicture: data.profilePicture || "/default-patient.png",
        dateOfBirth: data.dateOfBirth || "N/A",
        phoneNumber: data.phoneNumber || "N/A",
        emergencyContact: data.emergencyContact || "N/A",
        insuranceType: data.insuranceType || "N/A",
        diagnosisHistory: {
          create: data.diagnosisHistory || [],
        },
        diagnosticList: {
          create: data.diagnosticList || [],
        },
        labResults: {
          create: data.labResults || [],
        },
      },
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Create Patient Error:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
