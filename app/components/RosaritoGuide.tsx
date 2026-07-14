"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "../lib/LangContext";
import { SOCIAL_LINKS } from "../lib/social";
import { Compass, X, Sun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning, UtensilsCrossed, MapPin } from "lucide-react";

const ROSARITO_LAT = 32.3628;
const ROSARITO_LON = -117.0533;

const WEATHER_TEXT: Record<number, { en: string; es: string }> = {
  0: { en: "Clear sky", es: "Cielo despejado" },
  1: { en: "Mostly clear", es: "Mayormente despejado" },
  2: { en: "Partly cloudy", es: "Parcialmente nublado" },
  3: { en: "Overcast", es: "Nublado" },
  45: { en: "Foggy", es: "Neblina" },
  48: { en: "Foggy", es: "Neblina" },
  51: { en: "Light drizzle", es: "Llovizna ligera" },
  53: { en: "Drizzle", es: "Llovizna" },
  55: { en: "Heavy drizzle", es: "Llovizna intensa" },
  61: { en: "Light rain", es: "Lluvia ligera" },
  63: { en: "Rain", es: "Lluvia" },
  65: { en: "Heavy rain", es: "Lluvia intensa" },
  80: { en: "Rain showers", es: "Chubascos" },
  81: { en: "Rain showers", es: "Chubascos" },
  82: { en: "Violent showers", es: "Chubascos fuertes" },
  95: { en: "Thunderstorm", es: "Tormenta eléctrica" },
};

function weatherIcon(code: number) {
  if (code === 0 || code === 1) return Sun;
  if (code === 2 || code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 57) return CloudDrizzle;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return CloudRain;
  if (code >= 95) return CloudLightning;
  return Cloud;
}

type Weather = { tempF: number; code: number };

const GLASS: React.CSSProperties = {
  background: "rgba(var(--surface),0.32)",
  backdropFilter: "blur(28px) saturate(200%)",
  WebkitBackdropFilter: "blur(28px) saturate(200%)",
  border: "1px solid rgba(255,255,255,0.3)",
};

export default function RosaritoGuide() {
  const { locale, t } = useLang();
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [weather, setWeather] = useState<Weather | "error" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = hovering || pinned;

  useEffect(() => {
    if (weather !== null) return;
    if (!open) return;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${ROSARITO_LAT}&longitude=${ROSARITO_LON}&current=temperature_2m,weather_code&timezone=America%2FTijuana&temperature_unit=fahrenheit`
    )
      .then(r => r.json())
      .then(data => {
        setWeather({ tempF: Math.round(data.current.temperature_2m), code: data.current.weather_code });
      })
      .catch(() => setWeather("error"));
  }, [open, weather]);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHovering(true);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setHovering(false), 150);
  };

  const WeatherIcon = weather && weather !== "error" ? weatherIcon(weather.code) : Cloud;

  return (
    <div
      style={{ position: "fixed", top: 96, left: 20, zIndex: 45 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        onClick={() => setPinned(p => !p)}
        aria-label={t.guide.trigger}
        style={{
          ...GLASS,
          width: 46, height: 46, borderRadius: "50%",
          background: open ? "rgba(var(--accent),0.75)" : GLASS.background,
          color: open ? "#FAF6EE" : "rgb(var(--accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(var(--ink),0.15)",
          transition: "background 0.3s, color 0.3s",
        }}>
        {open ? <X size={18} /> : <Compass size={20} />}
      </button>

      {/* Panel */}
      <div
        style={{
          ...GLASS,
          position: "absolute", top: 58, left: 0,
          width: "min(360px, calc(100vw - 40px))",
          borderRadius: 26,
          boxShadow: "0 16px 48px rgba(var(--ink),0.25), inset 0 1px 0 rgba(255,255,255,0.35)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          maxHeight: "calc(100vh - 176px)",
          overflowY: "auto",
          padding: 20,
        }}>
        {/* Header row: title + weather badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "rgb(var(--ink))", fontWeight: 400 }}>
              {t.guide.title}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(var(--accent),0.85)", marginTop: 2 }}>
              {t.guide.subtitle}
            </div>
          </div>
          <div style={{
            ...GLASS, borderRadius: 18, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          }}>
            <WeatherIcon size={15} color="rgb(var(--accent))" />
            {weather === null && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(var(--ink),0.4)" }}>···</span>}
            {weather === "error" && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.4)" }}>—</span>}
            {weather && weather !== "error" && (
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--ink))" }}>{weather.tempF}°</span>
            )}
          </div>
        </div>

        {/* Restaurants | Places */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.25)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <UtensilsCrossed size={12} color="rgb(var(--accent))" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.55)" }}>
                {t.guide.restaurantsTitle}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {t.guide.restaurants.map((r, i) => (
                <div key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", color: "rgb(var(--ink))", lineHeight: 1.3 }}>
                  {r.name}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <MapPin size={12} color="rgb(var(--accent))" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.55)" }}>
                {t.guide.placesTitle}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {t.guide.places.map((p, i) => (
                <div key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", color: "rgb(var(--ink))", lineHeight: 1.3 }}>
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Follow */}
        {SOCIAL_LINKS.length > 0 && (
          <div style={{ paddingTop: 16, marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.25)" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.55)" }}>
              {t.guide.followTitle}
            </span>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {SOCIAL_LINKS.map(({ name, href, Icon, color, hoverColor }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = hoverColor}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = color}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
