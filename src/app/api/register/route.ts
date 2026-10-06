import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, gender, dateOfBirth, otp } = await req.json();

    if (!email || !password || !firstName || !lastName || !gender || !dateOfBirth || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: otp },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign default profile image based on gender
    const defaultImage = gender === "Female" 
      ? "/images/avatar-female.svg" 
      : "/images/avatar-male.svg";

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        gender,
        dateOfBirth,
        image: defaultImage
      },
    });

    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: otp
        }
      }
    });

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
