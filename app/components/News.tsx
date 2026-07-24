"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/LangContext";
import type { Post } from "../lib/posts";
import NewsCard from "./templates/NewsCard";

type PublicPost = Pick<Post, "id" | "image_url" | "template" | "content" | "created_at">;

export default function News() {
  const { locale, t } = useLang();
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setPosts(data.posts ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 90));
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [posts.length]);

  if (posts.length === 0) return null;

  return (
    <section ref={sectionRef} style={{ padding: "96px 24px", background: "rgb(var(--bg))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div className="sage-line" />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
            {t.news.title}
          </span>
        </div>
        <h2 className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em", marginBottom: 12 }}>
          {t.news.title}
        </h2>
        <p className="reveal" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.4)", fontSize: "0.88rem", marginBottom: 48 }}>
          {t.news.subtitle}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {posts.map(p => (
            <div key={p.id} className="reveal">
              <NewsCard
                content={p.content}
                imageUrl={p.image_url}
                template={p.template}
                locale={locale}
                dateLabel={new Date(p.created_at).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
