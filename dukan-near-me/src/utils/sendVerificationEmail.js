import sendEmail from "@/utils/sendEmail";

export async function sendVerificationEmail(email, token) {
  console.log("token", process.env.NEXTAUTH_URL);
  const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  const subject = "Verify your email - Nearby Dukan";
  const html = `
    <h2>Email Verification</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${verifyLink}">${verifyLink}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail(email, subject, html);
}
