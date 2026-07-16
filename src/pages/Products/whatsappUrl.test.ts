import { buildWhatsAppUrl, WHATSAPP_URL_MAX_LENGTH } from "./whatsappUrl";

const BASE_URL = "https://wa.me/5491156137150?text=Hola";
const PAGE_URL = "https://example.com/productos";

describe("buildWhatsAppUrl", () => {
  it("preserves selection order in the message", () => {
    const products = [
      { title: "Broche Casco Bacan" },
      { title: "Broche Lona Hembra Bronze" },
      { title: "Caballete Caño Inox" },
    ];

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    // The URL should contain the titles in order, with bullet separators
    // "•" (U+2022) encodes to %E2%80%A2, newline to %0A
    expect(result.href).toContain("Broche%20Casco%20Bacan");
    expect(result.href).toContain("%E2%80%A2%20Broche%20Lona%20Hembra%20Bronze");
    expect(result.href).toContain("%E2%80%A2%20Caballete%20Ca%C3%B1o%20Inox");

    // Verify order: b1 title appears before b2 title in the URL
    const idx1 = result.href.indexOf("Broche%20Casco%20Bacan");
    const idx2 = result.href.indexOf("Broche%20Lona%20Hembra%20Bronze");
    const idx3 = result.href.indexOf("Caballete");
    expect(idx1).toBeLessThan(idx2);
    expect(idx2).toBeLessThan(idx3);

    expect(result.isTooLong).toBe(false);
  });

  it("returns isTooLong=false and non-empty href for typical catalog size", () => {
    const products = Array.from({ length: 14 }, (_, i) => ({
      title: `Producto ${i + 1} con nombre realista`,
    }));

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    expect(result.isTooLong).toBe(false);
    expect(result.href).not.toBe("");
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(WHATSAPP_URL_MAX_LENGTH);
  });

  it("returns isTooLong=true and empty href when URL exceeds max length", () => {
    // Synthesize products with long titles to exceed 1800 chars
    const products = Array.from({ length: 200 }, (_, i) => ({
      title: `Producto número ${i + 1} con un nombre extremadamente largo para forzar el límite de caracteres`,
    }));

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    expect(result.isTooLong).toBe(true);
    expect(result.href).toBe("");
    expect(result.length).toBeGreaterThan(WHATSAPP_URL_MAX_LENGTH);
  });

  it("handles special characters in product titles without throwing", () => {
    const products = [
      { title: 'Broche "Plus" & Caño — 1/2″' },
      { title: "Lona #3 (añejada) [ref. Ñ]" },
    ];

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    expect(result.isTooLong).toBe(false);
    expect(result.href).not.toBe("");
    // Encoded special chars should be present
    expect(result.href).toContain("%26"); // &
    expect(result.href).toContain("Ca%C3%B1o"); // Caño
  });
});
