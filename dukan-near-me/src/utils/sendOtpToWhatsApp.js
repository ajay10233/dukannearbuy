import axios from "axios";

export async function sendOtpToWhatsApp(number, otp) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = "otp_template"; // Replace with your approved template name
  const languageCode = "en_US"; // Template language

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  try {
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: number,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: otp },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Failed to send OTP via WhatsApp:", err.response?.data || err.message);
    throw new Error("WhatsApp OTP sending failed");
  }
}
