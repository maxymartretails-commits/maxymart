import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail(
  to: string,
  subject: string = "Your Verification Code",
  htmlTemplate: any
) {
  try {
    const response = await resend.emails.send({
      from: "housewife<onboarding@resend.dev>", // Default domain
      to: to,
      subject: subject,
      html: htmlTemplate,
    });

    console.log("Email sent:");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
export default sendMail;
