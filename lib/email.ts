import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendDeliveryStatusEmail({
  to,
  receiverName,
  trackingId,
  status,
}: {
  to: string;
  receiverName: string;
  trackingId: string;
  status: string;
}) {
  await transporter.sendMail({
    from: `"LogiTrack" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Delivery Update: ${status}`,
    html: `
      <div style="font-family: Arial; background:#050505; color:white; padding:30px;">
        <h1 style="color:#c026d3;">LogiTrack Delivery Update</h1>
        <p>Hello ${receiverName},</p>
        <p>Your delivery status has been updated.</p>

        <div style="background:#18181b; padding:20px; border-radius:12px;">
          <p><strong>Tracking ID:</strong> ${trackingId}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>

        <p>Thank you for using LogiTrack.</p>
      </div>
    `,
  });
}