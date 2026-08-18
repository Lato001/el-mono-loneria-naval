import { useEffect } from "react";

interface MetaConfig {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_NAME = "El Mono — Lonería naval";
const SITE_DESCRIPTION =
  "Confección de lonas, cerramientos, capotas, cubreautos y fundas para motos de agua. Trabajo a medida con materiales técnicos de alta durabilidad.";
const ORIGIN = "https://elmonoloneria.com";
const DEFAULT_OG = `${ORIGIN}/og-image.png`;

function upsertMeta(
  selector: string,
  attr: string,
  value: string,
  tagName: "meta" = "meta",
): void {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(tagName);
    const keyMatch = selector.match(/(?:name|property)="([^"]+)"/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (selector.includes('property="')) {
        el.setAttribute("property", key);
      } else {
        el.setAttribute("name", key);
      }
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useDocumentMeta({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG,
  noIndex = false,
}: MetaConfig): void {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "content", description);
    upsertLink("canonical", `${ORIGIN}${path}`);

    upsertMeta('meta[name="robots"]', "content", noIndex ? "noindex, nofollow" : "index, follow");

    upsertMeta('meta[property="og:title"]', "content", fullTitle);
    upsertMeta('meta[property="og:description"]', "content", description);
    upsertMeta('meta[property="og:url"]', "content", `${ORIGIN}${path}`);
    upsertMeta('meta[property="og:image"]', "content", image);

    upsertMeta('meta[name="twitter:title"]', "content", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "content", description);
    upsertMeta('meta[name="twitter:image"]', "content", image);
  }, [title, description, path, image, noIndex]);
}