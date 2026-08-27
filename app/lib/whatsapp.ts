// Server-only: sends WhatsApp template messages via the Meta Cloud API using a
// permanent System User token. Never import this from a "use client" component.
const GRAPH_BASE = "https://graph.facebook.com/v21.0";

// Verified test-number recipients. Add TEAM_WHATSAPP_JORGE here once his number
// is added and verified as a recipient in the Meta dashboard — right now only
// Irving's is confirmed working.
function activeRecipients(): string[] {
  return [process.env.TEAM_WHATSAPP_IRVING].filter((n): n is string => !!n);
}

async function sendTemplate(to: string, templateName: string, params: string[]): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return false;

  try {
    const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "es_MX" },
          components: [{ type: "body", parameters: params.map(text => ({ type: "text", text })) }],
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendLeadAlert(lead: {
  name: string;
  contact: string; // email and/or phone, combined for display
  interest: string; // property title, or a general-contact label
  message: string;
}): Promise<void> {
  const params = [lead.name, lead.contact, lead.interest, lead.message || "(sin mensaje)"];
  // Fire in parallel; a failed send to one recipient shouldn't block another.
  await Promise.allSettled(
    activeRecipients().map(to => sendTemplate(to, "nuevo_lead_el_casa_rosarito", params))
  );
}

export async function sendWeeklyDigest(stats: {
  dateRange: string;
  visits: number;
  topProperty: string;
  newLeads: number;
}): Promise<void> {
  const params = [stats.dateRange, String(stats.visits), stats.topProperty, String(stats.newLeads)];
  await Promise.allSettled(
    activeRecipients().map(to => sendTemplate(to, "resumen_semanal_el_casa_rosarito", params))
  );
}
