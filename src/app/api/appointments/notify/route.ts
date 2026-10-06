import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { auth } from "@/auth";

const ADMIN_EMAIL = process.env.SMTP_EMAIL!;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ADMIN_EMAIL,
    pass: process.env.SMTP_PASSWORD!,
  },
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { patient, service, time, date } = await req.json();

    if (!patient || !service || !time) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Today";

    // Format time from 24h to 12h
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const formattedTime = `${h}:${mStr} ${ampm}`;

    const adminName = (session.user as any)?.name || "Doctor";

    await transporter.sendMail({
      from: `"Patient Dashboard" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 Appointment Alert: ${patient} at ${formattedTime}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f6f6f6; padding: 24px; border-radius: 16px;">
          <div style="background: #072635; border-radius: 12px; padding: 32px; color: white; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 40px; margin-bottom: 8px;">🏥</div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Appointment Reminder</h1>
            <p style="margin: 8px 0 0; opacity: 0.6; font-size: 14px;">Patient Dashboard Alert</p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
            <p style="margin: 0 0 16px; color: #707070; font-size: 14px;">Hello, <strong style="color: #072635;">${adminName}</strong> 👋</p>
            <p style="margin: 0 0 20px; color: #072635; font-size: 15px;">
              An appointment is starting <strong>right now</strong>. Here are the details:
            </p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 16px; background: #f6f7f8; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 700; color: #707070; text-transform: uppercase; letter-spacing: 0.05em;">Patient</td>
                <td style="padding: 12px 16px; background: #f6f7f8; border-radius: 8px 8px 0 0; font-size: 14px; font-weight: 800; color: #072635;">${patient}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-top: 1px solid #eee; font-size: 12px; font-weight: 700; color: #707070; text-transform: uppercase; letter-spacing: 0.05em;">Service</td>
                <td style="padding: 12px 16px; border-top: 1px solid #eee; font-size: 14px; font-weight: 700; color: #072635;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-top: 1px solid #eee; font-size: 12px; font-weight: 700; color: #707070; text-transform: uppercase; letter-spacing: 0.05em;">Time</td>
                <td style="padding: 12px 16px; border-top: 1px solid #eee; font-size: 14px; font-weight: 700; color: #01b89e;">${formattedTime}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-top: 1px solid #eee; border-radius: 0 0 8px 8px; font-size: 12px; font-weight: 700; color: #707070; text-transform: uppercase; letter-spacing: 0.05em;">Date</td>
                <td style="padding: 12px 16px; border-top: 1px solid #eee; border-radius: 0 0 8px 8px; font-size: 14px; font-weight: 700; color: #072635;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <div style="background: #01F0D0; border-radius: 12px; padding: 16px 24px; text-align: center;">
            <p style="margin: 0; font-size: 13px; font-weight: 800; color: #072635;">
              ⏰ Please be ready for your patient.
            </p>
          </div>

          <p style="margin: 20px 0 0; text-align: center; font-size: 11px; color: #aaa;">
            This alert was automatically sent by Patient Dashboard · Do not reply.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Appointment notify error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
