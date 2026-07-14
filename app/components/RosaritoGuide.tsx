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

type Weather = { tempF: number; code: number; highF: number; lowF: number };

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
      `https://api.open-meteo.com/v1/forecast?latitude=${ROSARITO_LAT}&longitude=${ROSARITO_LON}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FTijuana&temperature_unit=fahrenheit`
    )
      .then(r => r.json())
      .then(data => {
        setWeather({
          tempF: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
          highF: Math.round(data.daily.temperature_2m_max[0]),
          lowF: Math.round(data.daily.temperature_2m_min[0]),
        });
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
  const weatherLabel = weather && weather !== "error" ? WEATHER_TEXT[weather.code]?.[locale] ?? "—" : null;

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
          width: 46, height: 46, borderRadius: "50%",
          background: open ? "rgb(var(--accent))" : "rgb(var(--surface))",
          border: "1px solid rgba(var(--accent),0.3)",
          color: open ? "#FAF6EE" : "rgb(var(--accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 16px rgba(var(--ink),0.15)",
          transition: "background 0.3s, color 0.3s",
        }}>
        {open ? <X size={18} /> : <Compass size={20} />}
      </button>

      {/* Panel */}
      <div
        style={{
          position: "absolute", top: 58, left: 0,
          width: "min(340px, calc(100vw - 40px))",
          background: "rgba(var(--surface),0.55)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 12px 40px rgba(var(--ink),0.22), inset 0 1px 0 rgba(255,255,255,0.3)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          maxHeight: "calc(100vh - 176px)",
          overflowY: "auto",
        }}>
        {/* Header */}
        <div style={{ padding: "20px 22px", borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "rgb(var(--ink))", fontWeight: 400 }}>
            {t.guide.title}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(var(--accent),0.8)", marginTop: 2 }}>
            {t.guide.subtitle}
          </div>
        </div>

        {/* Weather */}
        <div style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(var(--accent),0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <WeatherIcon size={19} color="rgb(var(--accent))" />
          </div>
          {weather === null && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(var(--ink),0.4)" }}>{t.guide.weatherLoading}</span>
          )}
          {weather === "error" && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(var(--ink),0.4)" }}>{t.guide.weatherError}</span>
          )}
          {weather && weather !== "error" && (
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "rgb(var(--ink))" }}>{weather.tempF}°F</span>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(var(--ink),0.45)" }}>{weatherLabel}</span>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.35)", marginTop: 2 }}>
                H:{weather.highF}° L:{weather.lowF}°
              </div>
            </div>
          )}
        </div>

        {/* Restaurants */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <UtensilsCrossed size={13} color="rgb(var(--accent))" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)" }}>
              {t.guide.restaurantsTitle}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {t.guide.restaurants.map((r, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgb(var(--ink))", fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.4)" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Places */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <MapPin size={13} color="rgb(var(--accent))" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)" }}>
              {t.guide.placesTitle}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {t.guide.places.map((p, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgb(var(--ink))", fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.4)" }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow */}
        {SOCIAL_LINKS.length > 0 && (
          <div style={{ padding: "16px 22px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>
              {t.guide.followTitle}
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.4)", marginBottom: 12 }}>
              {t.guide.followSubtitle}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIAL_LINKS.map(({ name, href, Icon, color, hoverColor }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                  style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", background: color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = hoverColor}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = color}>
                  <Icon size={15} />
                  <span style={{ position: "absolute", top: -2, right: -2, width: 9, height: 9, borderRadius: "50%", background: "rgb(var(--accent))", border: "2px solid rgb(var(--surface))" }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
