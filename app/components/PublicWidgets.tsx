"use client";
import { usePathname } from "next/navigation";
import IntroCurtain from "./IntroCurtain";
import ScrollReveal from "./ScrollReveal";
import SocialFloat from "./SocialFloat";
import RosaritoGuide from "./RosaritoGuide";
import EventAnnouncement from "./EventAnnouncement";
import ConsentBanner from "./ConsentBanner";
import Tracker from "./Tracker";

export default function PublicWidgets() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <IntroCurtain />
      <ScrollReveal />
      <SocialFloat />
      <RosaritoGuide />
      <EventAnnouncement />
      <ConsentBanner />
      <Tracker />
    </>
  );
}
