export interface BuildWhatsAppUrlResult {
  href: string;
  isTooLong: boolean;
  length: number;
}

export const WHATSAPP_URL_MAX_LENGTH = 1800;

export function buildWhatsAppUrl(
  products: ReadonlyArray<{ title: string }>,
  baseUrl: string,
  pageUrl: string,
): BuildWhatsAppUrlResult {
  const message = [
    "Hola! Me interesa presupuestar los siguientes productos:",
    ...products.map((p) => `• ${p.title}`),
    "",
    `Página: ${pageUrl}`,
  ].join("\n");

  const encoded = encodeURIComponent(message);
  const href = `${baseUrl} ${encoded}`;

  if (href.length > WHATSAPP_URL_MAX_LENGTH) {
    return { href: "", isTooLong: true, length: href.length };
  }

  return { href, isTooLong: false, length: href.length };
}
