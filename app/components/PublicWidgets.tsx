"use client";
import { usePathname } from "next/navigation";
import IntroCurtain from "./IntroCurtain";
import SocialFloat from "./SocialFloat";
import RosaritoGuide from "./RosaritoGuide";
import EventAnnouncement from "./EventAnnouncement";

export default function PublicWidgets() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <IntroCurtain />
      <SocialFloat />
      <RosaritoGuide />
      <EventAnnouncement />
    </>
  );
}
