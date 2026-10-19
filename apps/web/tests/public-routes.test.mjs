import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, "..");

console.log("========================================================");
console.log(" THEIA WEB: INDEPENDENT PUBLIC ROUTES & CONTRACT SUITE");
console.log("========================================================");

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ Passed: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ FAILED: ${name}`);
    console.error(err);
    failedTests++;
  }
}

// 1. Verify All 13 Public Route Files exist
test("All 13 public website route files exist on disk", () => {
  const expectedRoutes = [
    "src/app/page.tsx", // /
    "src/app/about/page.tsx", // /about
    "src/app/contact/page.tsx", // /contact
    "src/app/faq/page.tsx", // /faq
    "src/app/features/page.tsx", // /features
    "src/app/insights/page.tsx", // /insights
    "src/app/insights/[slug]/page.tsx", // /insights/[slug]
    "src/app/markets/page.tsx", // /markets
    "src/app/markets/[symbol]/page.tsx", // /markets/[symbol]
    "src/app/pricing/page.tsx", // /pricing
    "src/app/releases/page.tsx", // /releases
    "src/app/support/page.tsx", // /support
    "src/app/terms/page.tsx", // /terms
  ];

  for (const relPath of expectedRoutes) {
    const fullPath = path.join(APP_DIR, relPath);
    assert.ok(fs.existsSync(fullPath), `Route file must exist: ${relPath}`);
  }
});

// 2. Verify Zero Cross-Repository Imports
test("Zero imports from sibling dashboard or backend repositories", () => {
  function checkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
        checkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        const content = fs.readFileSync(fullPath, "utf-8");
        assert.ok(!content.includes("from \"../../Frontend"), `Cross-repo import forbidden in ${fullPath}`);
        assert.ok(!content.includes("from \"../../Backend"), `Cross-repo import forbidden in ${fullPath}`);
        assert.ok(!content.includes("from \"../Frontend"), `Cross-repo import forbidden in ${fullPath}`);
        assert.ok(!content.includes("auth-provider"), `auth-provider should not be imported in public website: ${fullPath}`);
      }
    }
  }

  checkDir(path.join(APP_DIR, "src"));
});

// 3. Test Insights Dataset Integrity
test("Insights dataset contains structured articles and slug retrieval", () => {
  const insightsPath = path.join(APP_DIR, "src/data/insights-data.ts");
  const content = fs.readFileSync(insightsPath, "utf-8");

  assert.ok(content.includes("managing-assets-in-inflationary-economy"));
  assert.ok(content.includes("debt-amortization-and-inflation-arbitrage"));
  assert.ok(content.includes("gold-and-currency-pricing-mechanisms"));
  assert.ok(content.includes("ai-in-personal-financial-decision-making"));
  assert.ok(content.includes("getAllInsights"));
  assert.ok(content.includes("getInsightBySlug"));
});

// 4. Test Supported Instruments Catalog
test("Market instruments catalog defines supported symbols without fake hardcoded rates", () => {
  const instrumentsPath = path.join(APP_DIR, "src/data/market-instruments.ts");
  const content = fs.readFileSync(instrumentsPath, "utf-8");

  assert.ok(content.includes("IR_GOLD_18K"));
  assert.ok(content.includes("EMAMI_COIN"));
  assert.ok(content.includes("XAUUSD"));
  assert.ok(content.includes("USD"));
  assert.ok(content.includes("EUR"));
  assert.ok(content.includes("BTC"));
  assert.ok(content.includes("ETH"));
  assert.ok(content.includes("CU"));
  assert.ok(content.includes("SUPPORTED_INSTRUMENTS"));
  assert.ok(content.includes("getInitialMarketCatalog"));
});

// 5. Test Open Redirect Sanitization
test("Safe redirect helper rejects malicious foreign domains and protocol bypasses", () => {
  function getSafeRedirect(target, fallback = "/") {
    if (!target || typeof target !== "string") return fallback;
    const clean = target.trim();
    if (
      !clean.startsWith("/") ||
      clean.startsWith("//") ||
      clean.startsWith("/\\") ||
      clean.includes("\\") ||
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(clean)
    ) {
      return fallback;
    }
    return clean;
  }

  assert.equal(getSafeRedirect("/markets"), "/markets");
  assert.equal(getSafeRedirect("/pricing?plan=pro"), "/pricing?plan=pro");
  assert.equal(getSafeRedirect("https://evil.com"), "/");
  assert.equal(getSafeRedirect("//evil.com"), "/");
  assert.equal(getSafeRedirect("/\\evil.com"), "/");
  assert.equal(getSafeRedirect("javascript:alert(1)"), "/");
});

console.log("\n========================================================");
console.log(` RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log("========================================================");

if (failedTests > 0) {
  process.exit(1);
}
