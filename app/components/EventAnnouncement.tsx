"use client";
import { useState, useEffect } from "react";
import { Locale } from "../lib/translations";
import type { Announcement } from "../lib/announcements";
import { X } from "lucide-react";
import AnnouncementCard from "./templates/AnnouncementCard";

function seenKey(id: number) {
  return `announcementSeen_${id}`;
}

export default function EventAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [visible, setVisible] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    fetch("/api/announcements/active")
      .then(res => res.json())
      .then(data => setAnnouncement(data.announcement ?? null))
      .catch(() => setAnnouncement(null));
  }, []);

  useEffect(() => {
    if (!announcement) return;
    if (sessionStorage.getItem(seenKey(announcement.id))) return;
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, [announcement]);

  const dismiss = () => {
    setVisible(false);
    if (announcement) sessionStorage.setItem(seenKey(announcement.id), "1");
  };

  if (!announcement) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        background: "rgba(10,10,8,0.72)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
      onClick={dismiss}
    >
      <div style={{ width: "min(600px, 100%)", transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(12px)", transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
        <AnnouncementCard
          content={announcement.content}
          videoUrl={announcement.video_url}
          imageUrl={announcement.image_url}
          ctaUrl={announcement.content.ctaUrl}
          template={announcement.template}
          locale={locale}
          onLocaleChange={setLocale}
          onClose={dismiss}
          onWatchVideo={() => setVideoOpen(true)}
        />
      </div>

      {videoOpen && announcement.video_url && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 220, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.92)", padding: 20 }}
          onClick={() => setVideoOpen(false)}
        >
          <button onClick={() => setVideoOpen(false)} aria-label="Close"
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#FAF6EE", cursor: "pointer", padding: 8, display: "flex" }}>
            <X size={20} />
          </button>
          <video
            src={announcement.video_url}
            controls
            autoPlay
            style={{ maxWidth: "min(420px, 90vw)", maxHeight: "85vh" }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
