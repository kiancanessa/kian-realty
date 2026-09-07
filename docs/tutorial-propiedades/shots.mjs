// Vuelve a tomar las capturas del tutorial desde el panel real, para que el PDF
// nunca muestre una pantalla que ya cambió.
//
//   1. Levanta el sitio en local:  npm run dev
//   2. Crea una sesión temporal de admin y una propiedad de ejemplo en borrador.
//   3. TOK=<token de sesión> node docs/tutorial-propiedades/shots.mjs
//   4. python docs/tutorial-propiedades/build_pdf.py
//   5. Borra la sesión y la propiedad de ejemplo.
//
// Playwright no es dependencia del proyecto. Si no lo tienes instalado, apunta
// PW a una copia existente:
//   PW=file:///C:/Users/<tu-usuario>/AppData/Local/npm-cache/_npx/<hash>/node_modules/playwright/index.mjs
//
// Usa el Edge ya instalado en la máquina, así que no hay que descargar navegadores.

const { chromium } = await import(process.env.PW || "playwright");

const OUT = "docs/tutorial-propiedades/images";
const TOK = process.env.TOK;
if (!TOK) throw new Error("Falta TOK: el token de la sesión de admin.");

const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({ viewport: { width: 1320, height: 1000 }, deviceScaleFactor: 2 });
await ctx.addCookies([{ name: "ecr_session", value: TOK, url: "http://localhost:3000" }]);
const page = await ctx.newPage();

const el = async (name, sel) => {
  await page.locator(sel).first().screenshot({ path: `${OUT}/${name}.png` });
  console.log("✓", name);
};
const clip = async (name, box) => {
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: box });
  console.log("✓", name);
};

await page.goto("http://localhost:3000/admin/properties", { waitUntil: "networkidle" });
await page.waitForTimeout(1600);

await clip("01-menu", { x: 0, y: 0, width: 1320, height: 58 });
await clip("02-lista", { x: 0, y: 0, width: 1320, height: 370 });

await page.locator('button[title="Editar"]').first().click();
await page.waitForSelector(".prop-editor-layout");
await page.waitForTimeout(1800);

await el("03-editor", ".prop-editor-layout");
await el("04-fotos", ".prop-editor-layout section");
await el("05-preview", ".prop-editor-preview");

await page.locator('button[aria-label="Celular"]').click();
await page.waitForTimeout(800);
await el("06-movil", ".prop-editor-preview");
await page.locator('button[aria-label="Escritorio"]').click();
await page.waitForTimeout(400);

// Los recortes se calculan desde el botón para que no dependan del alto exacto
// de la página, que cambia con la cantidad de campos llenos.
const save = page.locator('button:has-text("Guardar")').first();
await save.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const sb = await save.boundingBox();
const right = Math.min(1320, sb.x + sb.width + 26);
await clip("07-guardar", { x: Math.max(0, right - 620), y: Math.max(0, sb.y - 26), width: right - Math.max(0, right - 620), height: sb.height + 52 });

await page.locator('button:has-text("Cancelar")').first().click();
await page.waitForTimeout(1400);
const row = page.locator('button[title="Editar"]').first();
await row.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
const rb = await row.boundingBox();
await clip("08-publicar", { x: 40, y: Math.max(0, rb.y - 44), width: 1240, height: 126 });

await browser.close();
console.log("Listo. Ahora corre build_pdf.py.");
