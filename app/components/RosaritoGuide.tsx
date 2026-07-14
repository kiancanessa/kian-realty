"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "../lib/LangContext";
import { SOCIAL_LINKS } from "../lib/social";
import { Compass, X, Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning, UtensilsCrossed, MapPin, Droplets, Umbrella, Wind } from "lucide-react";

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
  if (code === 0) return Sun;
  if (code === 1 || code === 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 57) return CloudDrizzle;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return CloudRain;
  if (code >= 95) return CloudLightning;
  return Cloud;
}

function dayLabel(dateStr: string, locale: "en" | "es") {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { weekday: "short", timeZone: "UTC" });
}

type WeatherNow = { tempF: number; feelsF: number; humidity: number; windKmh: number; precipPct: number; code: number };
type DayForecast = { date: string; code: number; highF: number; lowF: number };
type WeatherData = { now: WeatherNow; days: DayForecast[] };

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
  const [weather, setWeather] = useState<WeatherData | "error" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = hovering || pinned;

  useEffect(() => {
    if (weather !== null) return;
    if (!open) return;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${ROSARITO_LAT}&longitude=${ROSARITO_LON}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=America%2FTijuana&temperature_unit=fahrenheit&wind_speed_unit=kmh&forecast_days=6`
    )
      .then(r => r.json())
      .then(data => {
        setWeather({
          now: {
            tempF: Math.round(data.current.temperature_2m),
            feelsF: Math.round(data.current.apparent_temperature),
            humidity: Math.round(data.current.relative_humidity_2m),
            windKmh: Math.round(data.current.wind_speed_10m * 10) / 10,
            precipPct: Math.round(data.daily.precipitation_probability_max[0]),
            code: data.current.weather_code,
          },
          days: data.daily.time.map((date: string, i: number) => ({
            date,
            code: data.daily.weather_code[i],
            highF: Math.round(data.daily.temperature_2m_max[i]),
            lowF: Math.round(data.daily.temperature_2m_min[i]),
          })),
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

  const WeatherIcon = weather && weather !== "error" ? weatherIcon(weather.now.code) : Cloud;

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
          width: 52, height: 52, borderRadius: "50%",
          background: open ? "rgba(var(--accent),0.75)" : GLASS.background,
          color: open ? "#FAF6EE" : "rgb(var(--accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(var(--ink),0.15)",
          transition: "background 0.3s, color 0.3s",
        }}>
        {open ? <X size={20} /> : <Compass size={23} />}
      </button>

      {/* Panel */}
      <div
        style={{
          ...GLASS,
          position: "absolute", top: 64, left: 0,
          width: "min(440px, calc(100vw - 40px))",
          borderRadius: 28,
          boxShadow: "0 16px 48px rgba(var(--ink),0.25), inset 0 1px 0 rgba(255,255,255,0.35)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          maxHeight: "calc(100vh - 184px)",
          overflowY: "auto",
          padding: 26,
        }}>
        {/* Header row: title + weather badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.55rem", color: "rgb(var(--ink))", fontWeight: 400 }}>
              {t.guide.title}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(var(--accent),0.85)", marginTop: 2 }}>
              {t.guide.subtitle}
            </div>
          </div>
          <div style={{
            ...GLASS, borderRadius: 20, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          }}>
            <WeatherIcon size={18} color="rgb(var(--accent))" />
            {weather === null && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "rgba(var(--ink),0.4)" }}>···</span>}
            {weather === "error" && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(var(--ink),0.4)" }}>—</span>}
            {weather && weather !== "error" && (
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgb(var(--ink))" }}>{weather.now.tempF}°</span>
            )}
          </div>
        </div>

        {/* Weather detail */}
        {weather && weather !== "error" && (
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)", marginBottom: 14 }}>
              {WEATHER_TEXT[weather.now.code]?.[locale] ?? "—"} · {t.guide.feelsLike} {weather.now.feelsF}°
            </div>

            {/* 6-day strip */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
              {weather.days.map((d, i) => {
                const DayIcon = weatherIcon(d.code);
                return (
                  <div key={d.date} style={{
                    ...GLASS, borderRadius: 14, padding: "10px 8px", minWidth: 54, flexShrink: 0,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    background: i === 0 ? "rgba(var(--accent),0.18)" : GLASS.background,
                  }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", textTransform: "capitalize", color: "rgba(var(--ink),0.55)" }}>
                      {dayLabel(d.date, locale)}
                    </span>
                    <DayIcon size={16} color="rgb(var(--accent))" />
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgb(var(--ink))", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {d.highF}° <span style={{ color: "rgba(var(--ink),0.4)" }}>{d.lowF}°</span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { Icon: Droplets, label: t.guide.humidity, value: `${weather.now.humidity}%` },
                { Icon: Umbrella, label: t.guide.precipitation, value: `${weather.now.precipPct}%` },
                { Icon: Wind, label: t.guide.wind, value: `${weather.now.windKmh} Km/h` },
              ].map(({ Icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Icon size={13} color="rgb(var(--accent))" />
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgba(var(--ink),0.55)" }}>{label}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "rgb(var(--ink))" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurants | Places */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.25)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <UtensilsCrossed size={14} color="rgb(var(--accent))" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.55)" }}>
                {t.guide.restaurantsTitle}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {t.guide.restaurants.map((r, i) => (
                <div key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--ink))", lineHeight: 1.3 }}>
                  {r.name}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <MapPin size={14} color="rgb(var(--accent))" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.55)" }}>
                {t.guide.placesTitle}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {t.guide.places.map((p, i) => (
                <div key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--ink))", lineHeight: 1.3 }}>
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Follow */}
        {SOCIAL_LINKS.length > 0 && (
          <div style={{ paddingTop: 20, marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.25)" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.55)" }}>
              {t.guide.followTitle}
            </span>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              {SOCIAL_LINKS.map(({ name, href, Icon, color, hoverColor }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                  style={{ width: 38, height: 38, borderRadius: "50%", background: color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = hoverColor}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = color}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
