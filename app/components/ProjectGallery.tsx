"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";

export default function ProjectGallery({ images, alt, height = 420 }: { images: string[]; alt: string; height?: number }) {
  const [index, setIndex] = useState(0);
  const hovering = useRef(false);

  const goTo = useCallback((i: number) => {
    setIndex(prev => {
      const len = images.length;
      return len === 0 ? prev : (i + len) % len;
    });
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      if (!hovering.current) setIndex(prev => (prev + 1) % images.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div style={{ height, background: "rgb(var(--bg-alt))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Building2 size={40} color="rgba(var(--accent),0.35)" strokeWidth={1.3} />
      </div>
    );
  }

  return (
    <div
      style={{ position: "relative", height, overflow: "hidden", background: "rgb(var(--bg-alt))" }}
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      {images.map((src, i) => (
        <img key={src + i} src={src} alt={`${alt} ${i + 1}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === index ? 1 : 0, transform: i === index ? "scale(1.04)" : "scale(1)", transition: "opacity 1.3s ease, transform 6s ease-out" }} />
      ))}

      {images.length > 1 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,8,0.35), transparent 40%)", pointerEvents: "none" }} />
          <button aria-label="Previous photo" onClick={() => goTo(index - 1)}
            style={{ position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(250,246,238,0.4)", background: "rgba(10,10,8,0.4)", color: "#FAF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}>
            <ChevronLeft size={20} />
          </button>
          <button aria-label="Next photo" onClick={() => goTo(index + 1)}
            style={{ position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(250,246,238,0.4)", background: "rgba(10,10,8,0.4)", color: "#FAF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}>
            <ChevronRight size={20} />
          </button>
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
            {images.map((src, i) => (
              <button key={src + i} aria-label={`Go to photo ${i + 1}`} onClick={() => goTo(i)}
                style={{ width: i === index ? 20 : 7, height: 7, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", background: i === index ? "#FAF6EE" : "rgba(250,246,238,0.45)", transition: "width 0.3s ease" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
