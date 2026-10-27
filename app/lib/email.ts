// Sending email to visitors (alerts, confirmations).
//
// The site's form service (Web3Forms) only writes to the team, never to a
// visitor, so this goes through Resend's HTTP API. Nothing here runs until
// RESEND_API_KEY is set, and the sender domain must be verified in Resend:
// until then every caller falls back to handing the lead to the team.
import "server-only";

const FROM = process.env.ALERTS_FROM ?? "El Casa Rosarito <alertas@elcasarosaritogroup.com>";
// Overridable so the whole flow can be exercised against a local stand-in.
const API_URL = process.env.RESEND_API_URL ?? "https://api.resend.com/emails";

export const emailConfigured = (): boolean => Boolean(process.env.RESEND_API_KEY);

export type Mail = { to: string; subject: string; html: string; text: string; unsubscribeUrl?: string };

/** True only when the provider accepted the message. */
export async function sendEmail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        // Mail clients show their own "unsubscribe" button from this, and it is
        // what keeps these messages out of the spam folder.
        ...(mail.unsubscribeUrl ? { headers: { "List-Unsubscribe": `<${mail.unsubscribeUrl}>` } } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
