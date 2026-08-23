import puppeteer from "puppeteer";

const BASE = "http://localhost:3000";

const PAGES = [
  "/",
  "/id/new-arrivals",
  "/id/skirts",
  "/id/tops",
  "/id/pants",
  "/id/others",
  "/id/curated/gifts",
  "/id/products/AGATE-AGATE-SKIRT",
  "/id/faq",
  "/id/hubungi-kami",
  "/id/lokasi-toko",
  "/id/panduan-ukuran",
  "/id/pengembalian",
  "/id/pengiriman-pelacakan",
  "/id/perawatan-produk",
  "/id/press/editorials",
  "/id/privacy-policy",
  "/id/cookies-policy",
  "/id/terms-of-use",
  "/id/admin/login",
];

async function testPages() {
  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  for (const path of PAGES) {
    const page = await browser.newPage();
    const errors = [];
    const consoleErrors = [];

    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    let status = 0;
    try {
      const res = await page.goto(BASE + path, {
        waitUntil: "networkidle2",
        timeout: 20000,
      });
      status = res?.status() ?? 0;

      // Check for Next.js error overlay in shadow DOM only
      const errorOverlayText = await page.evaluate(() => {
        const portal = document.querySelector("nextjs-portal");
        if (!portal?.shadowRoot) return null;
        const header = portal.shadowRoot.querySelector("[data-nextjs-dialog-header]");
        const body = portal.shadowRoot.querySelector("[data-nextjs-dialog-body]");
        if (!header && !body) return null;
        return (header?.textContent || "") + " " + (body?.textContent || "");
      });

      // Check for error in HTML attributes (SSR errors)
      const ssrError = await page.evaluate(() => {
        const tmpl = document.querySelector("template[data-next-error-message]");
        return tmpl ? tmpl.getAttribute("data-next-error-message") : null;
      });

      const hasRealError = !!errorOverlayText || !!ssrError;

      results.push({
        path,
        status,
        ok: status < 400 && errors.length === 0 && !hasRealError,
        errors: errors.slice(0, 3),
        consoleErrors: consoleErrors.filter(e => !e.includes("favicon")).slice(0, 3),
        errorDetail: errorOverlayText?.slice(0, 200) || ssrError?.slice(0, 200) || null,
      });
    } catch (e) {
      results.push({ path, status, ok: false, errors: [e.message], consoleErrors: [] });
    }

    await page.close();
  }

  await browser.close();

  console.log("\n=== PAGE TEST RESULTS ===\n");
  let failCount = 0;
  for (const r of results) {
    const icon = r.ok ? "✓" : "✗";
    const statusStr = r.status ? ` [${r.status}]` : "";
    console.log(`${icon} ${r.path}${statusStr}`);
    if (!r.ok) {
      failCount++;
      if (r.errorDetail) console.log(`  → Error: ${r.errorDetail}`);
      for (const e of r.errors) console.log(`  → Page error: ${e.slice(0, 200)}`);
      for (const e of r.consoleErrors) console.log(`  → Console error: ${e.slice(0, 200)}`);
    }
  }

  console.log(`\n${PAGES.length - failCount}/${PAGES.length} pages OK`);
  if (failCount > 0) {
    console.log(`${failCount} page(s) have errors`);
    process.exit(1);
  }
}

testPages().catch((e) => {
  console.error("Test runner failed:", e.message);
  process.exit(1);
});
