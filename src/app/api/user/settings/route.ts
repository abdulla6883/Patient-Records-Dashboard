import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        firstName: true,
        lastName: true,
        gender: true,
        dateOfBirth: true,
        email: true,
        name: true,
        image: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, gender, dateOfBirth, image } = await req.json();

    let imagePath: string | undefined;

    if (image?.startsWith("data:image/")) {
      const matches = image.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
      if (!matches) {
        return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
      }

      const [, extension, encodedImage] = matches;
      const buffer = Buffer.from(encodedImage, "base64");
      if (buffer.length > 3 * 1024 * 1024) {
        return NextResponse.json({ error: "Image must be 3 MB or smaller" }, { status: 413 });
      }

      const contentType = `image/${extension}`;
      const blob = await put(
        `profiles/${session.user.id || "user"}-${randomUUID()}.${extension}`,
        buffer,
        { access: "public", contentType },
      );
      imagePath = blob.url;
    }

    const dataToUpdate: any = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      gender,
      dateOfBirth
    };

    if (imagePath) {
      dataToUpdate.image = imagePath;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prisma cascades deletes if set up, or you can delete user
    // In schema.prisma, we might need to delete related data manually if not set up with Cascade.
    // Let's delete the user. The schema might have onDelete: Cascade or we just delete the user.
    await prisma.user.delete({
      where: { email: session.user.email }
    });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
