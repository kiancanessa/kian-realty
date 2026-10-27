// Genera los PDF de la guía para comprar propiedad en México (es y en) en
// public/guias/. El texto sale de app/lib/guideContent.ts, el mismo que usa la
// página, así que no pueden diferir.
//
// Necesita Node 22+ (lee el .ts directamente) y un Chromium. El proyecto no
// depende de Playwright; se le indica dónde está:
//
//   PLAYWRIGHT_PATH=/ruta/a/node_modules/playwright node scripts/guide-pdf.mjs
//
// Hay que correrlo de nuevo cada vez que cambie el texto de la guía.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GUIDE, GUIDE_UPDATED } from "../app/lib/guideContent.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH ?? "playwright");

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const css = `
  @page { size: Letter; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; background: #fff; color: #1D2014; font-family: 'Jost', sans-serif; font-weight: 300; font-size: 10.1pt; line-height: 1.55; }
  .brand { font-family: 'Jost', sans-serif; font-weight: 500; font-size: 8.5pt; letter-spacing: 0.32em; text-transform: uppercase; color: #47592B; }
  .rule { width: 56px; height: 2px; background: #6B8A42; margin: 8px 0 24px; }
  h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 30pt; line-height: 1.08; letter-spacing: -0.01em; margin: 0 0 8px; }
  .updated { font-size: 8.5pt; letter-spacing: 0.08em; color: #6B8A42; margin: 0 0 24px; }
  h2 { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 15.5pt; color: #47592B; margin: 20px 0 6px; break-after: avoid; }
  p { margin: 0 0 9px; }
  ul, ol { margin: 0 0 9px; padding-left: 20px; }
  li { margin-bottom: 4px; break-inside: avoid; }
  .intro p { font-size: 11pt; }
  .disclaimer { margin-top: 22px; padding: 12px 16px; border-left: 3px solid #6B8A42; background: rgba(107,138,66,0.1); font-size: 9pt; }
  .contact { margin-top: 16px; font-size: 9.5pt; }
  .contact strong { font-weight: 500; }
`;

function html(lang) {
  const g = GUIDE[lang];
  const sections = g.sections.map(s => `
    <section>
      <h2>${esc(s.h2)}</h2>
      ${(s.paragraphs ?? []).map(t => `<p>${esc(t)}</p>`).join("")}
      ${s.bullets ? `<ul>${s.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
      ${s.steps ? `<ol>${s.steps.map(b => `<li>${esc(b)}</li>`).join("")}</ol>` : ""}
    </section>`).join("");
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(g.title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
    <style>${css}</style></head><body><div class="page">
      <div class="brand">El Casa Rosarito</div><div class="rule"></div>
      <h1>${esc(g.h1)}</h1>
      <p class="updated">${esc(g.updated)}</p>
      <div class="intro">${g.intro.map(t => `<p>${esc(t)}</p>`).join("")}</div>
      ${sections}
      <p class="disclaimer">${esc(g.disclaimer)}</p>
      <p class="contact"><strong>El Casa Rosarito</strong> · Local 19 Módulo A, Quinta Plaza, Playas de Rosarito, B.C.<br>
        WhatsApp +52 661 125 6107 · jorgeelcasarosarito@gmail.com · elcasarosaritogroup.com</p>
    </div></body></html>`;
}

const out = join(root, "public", "guias");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROME_CHANNEL ? { channel: process.env.CHROME_CHANNEL } : {});
for (const lang of ["es", "en"]) {
  const page = await browser.newPage();
  await page.setContent(html(lang), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const file = join(root, "public", GUIDE[lang].pdf);
  await page.pdf({
    path: file, format: "Letter", printBackground: true,
    margin: { top: "0.7in", bottom: "0.8in", left: "0.85in", right: "0.85in" },
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-size:7.5pt;color:#6B6F5C;text-align:center;font-family:sans-serif;">El Casa Rosarito · elcasarosaritogroup.com · ${GUIDE_UPDATED} · <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
  });
  console.log("PDF:", file);
  await page.close();
}
await browser.close();
