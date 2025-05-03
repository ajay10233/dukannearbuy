import sendEmail from "@/utils/sendEmail";

export async function sendVerificationEmail(email, otp) {
  const subject = "Your OTP for Nearby Dukan Email Verification";
  const html = `
    <h2>Email Verification OTP</h2>
    <p>Your One-Time Password (OTP) for verifying your email is:</p>
    <h3>${otp}</h3>
    <p>This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
  `;

  await sendEmail(email, subject, html);
}
