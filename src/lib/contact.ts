/**
 * Canonical WhatsApp contact link for El Mono.
 *
 * Plain wa.me deep link with NO preset message — users land on WhatsApp
 * with an empty composer so they write their own request. Used by:
 *   - the floating action button (src/components/ui/Button/WhatsappButton.tsx)
 *   - the LinkButton "Contact" variant (mobile nav menu, ContactGrid CTA)
 *
 * Other CTAs in the app (Products quote-cart, etc.) still use
 * VITE_WHATSAPP_URL with a preset message, since those carry real intent
 * (a list of selected products). Those are intentional UX, not generic
 * contact entry points.
 */
export const CONTACT_WHATSAPP_URL = "https://wa.me/5491169906255";
export const CONTACT_TEL_URL = "tel:+5491169906255";