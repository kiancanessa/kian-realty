"use client";
import { Phone } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { JORGE_WHATSAPP } from "../lib/contact";
import { whatsappLink } from "../lib/sendInquiry";
import { WhatsAppIcon } from "../lib/social";

/** On a phone the contact card of a property sits far down the page. This bar
 *  keeps the two fastest ways to reach the team in thumb range, with the
 *  property already in the message. Hidden on larger screens (see .pcb). */
export default function PropertyContactBar({ id, title }: { id: string; title: string }) {
  const { t } = useLang();
  const message = `${t.pcb.message.replace("{title}", title).replace("{id}", id)}\nhttps://elcasarosaritogroup.com/propiedades/${id}`;
  return (
    <div className="pcb" role="region" aria-label={t.pcb.label}>
      <a className="pcb-wa" href={whatsappLink(JORGE_WHATSAPP, message)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={18} /> {t.pcb.whatsapp}
      </a>
      <a className="pcb-call" href="tel:+526611256107">
        <Phone size={17} aria-hidden /> {t.pcb.call}
      </a>
    </div>
  );
}
