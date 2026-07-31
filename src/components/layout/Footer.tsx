import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
  type Icon,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { data } from "../../mocks/data";
import type { ContactIconKey, SocialPlatform } from "../../mocks/types";
import isotipoElmono from "../../assets/logos/elmono/isotipo-elmono.png";
import letteringElMono from "../../assets/logos/elmono/isotipo-elmono-name.png";

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

const { nav, global } = data;

export function Footer() {
  const iconLinks = [
    ...nav.footer.social.map(({ platform, href }) => ({
      icon: socialIconMap[platform],
      href,
    })),
    ...nav.footer.contact.map(({ iconKey, href }) => ({
      icon: contactIconMap[iconKey],
      href,
    })),
  ];

  return (
    <footer className="bg-sc-ocean-blue p-10 ">
      <div className="mx-auto flex max-w-295 pb-4 flex-col items-center gap-6 lg:flex-row lg:justify-between border-b border-pr-aquamarine/60">
        {/* Logo */}
        <div>
          <a href="/" className="flex items-center gap-2">
            <img
              src={isotipoElmono}
              alt={global.brandLogoAlt}
              className="h-14"
            />
            <img
              src={letteringElMono}
              alt={global.brandLogoAlt}
              className="h-14"
            />
          </a>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {nav.header.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="font-poppins text-sm text-white/70 transition-colors hover:text-pr-aquamarine"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sociales */}
        <div className="flex items-center gap-4">
          {iconLinks.map(({ icon: Icon, href }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-white/70 transition-colors hover:text-pr-aquamarine"
            >
              <Icon className="size-6" />
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-295 flex-col items-center mt-2 justify-end   text-sm text-white/50 lg:flex-row">
        <p>{nav.footer.copyright}</p>
      </div>
    </footer>
  );
}
