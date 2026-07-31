import { Link } from "react-router-dom";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
  type Icon,
} from "@tabler/icons-react";
import isotipoElmono from "../../assets/logos/elmono/isotipo-elmono.png";
import { data } from "../../mocks/data";
import type { ContactIconKey, SocialPlatform } from "../../mocks/types";

const socialIconMap: Record<SocialPlatform, Icon> = {
  Facebook: IconBrandFacebook,
  Instagram: IconBrandInstagram,
  WhatsApp: IconBrandWhatsapp,
};

const contactIconMap: Record<ContactIconKey, Icon> = {
  phone: IconPhone,
  mail: IconMail,
  mapPin: IconMapPin,
};

function handleLogoError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export function Footer() {
  const { groups, social, contact, tagline, copyright, contactTitle } =
    data.nav.footer;

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
              alt={data.global.brandLogoAlt}
              className="h-20 w-20"
              onError={handleLogoError}
            />
            <p className="font-poppins text-xl leading-snug text-white/70">
              {tagline}
            </p>
            <div className="flex gap-2">
              {social.map(({ platform, href }) => {
                const Icon = socialIconMap[platform];
                return (
                  <a
                    key={platform}
                    href={href}
                    aria-label={platform}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-pr-aquamarine hover:text-pr-aquamarine"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2 — Navigation (col-span-8, 4 uniform sub-cols shifted right) */}
          <nav
            aria-label="Navegación del sitio"
            className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 lg:col-span-8"
          >
            {groups.map((group) => (
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
              {contactTitle}
            </h4>
            <ul className="flex flex-col gap-2">
              {contact.map(({ label, value, href, iconKey }) => {
                const Icon = contactIconMap[iconKey];
                return (
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
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="font-poppins text-center text-xs text-white/50">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
