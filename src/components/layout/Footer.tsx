import { Link } from "react-router-dom";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { PATHS } from "../../routes/routes";
import isotipoElmono from "../../assets/logos/elmono/isotipo-elmono-01.png";

// TODO: sub-page hrefs are placeholders — replace with real routes when sub-pages are implemented
const navGroups: Array<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    title: "Servicios",
    links: [
      { label: "Lonas a Medida", href: "/servicios/lonas-a-medida" },
      { label: "Capotas para Embarcaciones", href: "/servicios/capotas" },
      { label: "Cubreautos y Fundas", href: "/servicios/cubreautos" },
    ],
  },
  {
    title: "Productos",
    links: [{ label: "Catálogo", href: PATHS.PRODUCTS }],
  },
  {
    title: "Nosotros",
    links: [
      { label: "Sobre el Taller", href: PATHS.ABOUT_US },
      { label: "Equipo", href: "/nosotros/equipo" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "FAQ", href: PATHS.FAQ },
      { label: "Contacto", href: PATHS.CONTACT },
    ],
  },
];

const socialLinks = [
  {
    icon: IconBrandFacebook,
    label: "Facebook",
    /* TODO: replace with real URL */
    href: "#",
  },
  {
    icon: IconBrandInstagram,
    label: "Instagram",
    /* TODO: replace with real URL */
    href: "#",
  },
  {
    icon: IconBrandWhatsapp,
    label: "WhatsApp",
    /* TODO: replace with real URL */
    href: "#",
  },
];

const contactItems: Array<{
  icon: Icon;
  label: string;
  value: string;
  href: string;
}> = [
  {
    icon: IconPhone,
    label: "Tel\u00e9fono",
    /* TODO: replace with real phone number */
    value: "+54 9 11 0000-0000",
    href: "tel:+5491100000000",
  },
  {
    icon: IconMail,
    label: "Email",
    /* TODO: replace with real email */
    value: "contacto@elmono.com.ar",
    href: "mailto:contacto@elmono.com.ar",
  },
  {
    icon: IconMapPin,
    label: "Direcci\u00f3n",
    /* TODO: replace with real address */
    value: "Buenos Aires, Argentina",
    href: "#",
  },
];

function handleLogoError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export function Footer() {
  return (
    <footer className="bg-sc-ocean-blue px-6 py-8 text-white">
      <div className="mx-auto max-w-295">
        {/* Top section: 12-col grid — brand(2) + nav(8) + contact(2) */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Col 1 — Brand (col-span-2) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            {/* TODO: review logo — currently using isotipo SVG; may want a dedicated footer logo later */}
            <img
              src={isotipoElmono}
              alt="El Mono — Lonería Naval"
              className="h-12 w-12"
              onError={handleLogoError}
            />
            <p className="font-poppins text-xs leading-snug text-white/70">
              {/* TODO: tagline */}
              El Mono · Lonería Naval desde [año]
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-pr-aquamarine hover:text-pr-aquamarine"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigation (col-span-8, 4 uniform sub-cols shifted right) */}
          <nav
            aria-label="Navegación del sitio"
            className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 lg:col-span-8"
          >
            {navGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <h5 className="font-poppins text-xs font-semibold uppercase tracking-wider text-white/90">
                  {group.title}
                </h5>
                <ul className="flex flex-col gap-1.5">
                  {group.links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        to={href}
                        className="font-poppins text-sm text-white/70 transition-colors hover:text-pr-aquamarine hover:underline"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Col 3 — Contact (col-span-2) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-pr-aquamarine">
              Contacto
            </h4>
            <ul className="flex flex-col gap-2">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-2">
                  <Icon
                    size={16}
                    className="mt-0.5 shrink-0 text-pr-aquamarine"
                  />
                  <a
                    href={href}
                    className="font-poppins text-xs leading-snug text-white/70 transition-colors hover:text-pr-aquamarine hover:underline"
                  >
                    {value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="font-poppins text-center text-xs text-white/50">
            © 2026 El Mono Lonería Naval. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
