import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';
import { data } from '../../mocks/data';

function renderFooter() {
  return render(<Footer />, { wrapper: MemoryRouter });
}

describe('Footer', () => {
  it('renders the two brand logo images', () => {
    renderFooter();
    const logos = screen.getAllByAltText('El Mono — Lonería Naval');
    expect(logos).toHaveLength(2);
    for (const logo of logos) {
      expect(logo.tagName).toBe('IMG');
    }
  });

  it('renders the main navigation links from nav.header', () => {
    renderFooter();
    for (const link of data.nav.header) {
      const rendered = screen.getByRole('link', { name: link.label });
      expect(rendered).toBeInTheDocument();
      expect(rendered.tagName).toBe('A');
      expect(rendered).toHaveAttribute('href', link.href);
    }
  });

  it('renders social and contact icon links with the expected hrefs', () => {
    renderFooter();
    for (const item of data.nav.footer.social) {
      expect(document.querySelector(`a[href="${item.href}"]`)).not.toBeNull();
    }
    for (const item of data.nav.footer.contact) {
      expect(document.querySelector(`a[href="${item.href}"]`)).not.toBeNull();
    }
  });

  it('opens external social links in a new tab with rel=noopener', () => {
    renderFooter();
    const facebook = document.querySelector(
      `a[href="${data.nav.footer.social[0].href}"]`,
    );
    expect(facebook).toHaveAttribute('target', '_blank');
    expect(facebook).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the copyright text', () => {
    renderFooter();
    expect(
      screen.getByText(/2026 El Mono Lonería Naval/),
    ).toBeInTheDocument();
  });

  describe('DevBadge signature', () => {
    it('renders the developer name, role and avatar photo in the signature line', () => {
      renderFooter();
      expect(screen.getByText('Desarrollado por')).toBeInTheDocument();
      expect(screen.getByText('Lautaro Camejo')).toBeInTheDocument();
      // The badge now uses a photo avatar instead of initials; the <img>
      // alt matches the developer name.
      expect(screen.getByAltText('Lautaro Camejo')).toBeInTheDocument();
    });

    it('links to the dev LinkedIn profile from the badge', () => {
      renderFooter();
      // The badge renders two anchors with this aria-label (avatar wrapper +
      // icon-only button). Assert each one points at the right URL.
      const linkedinLinks = screen.getAllByRole('link', {
        name: /LinkedIn de Lautaro Camejo/i,
      });
      expect(linkedinLinks.length).toBeGreaterThanOrEqual(1);
      for (const link of linkedinLinks) {
        expect(link).toHaveAttribute(
          'href',
          'https://www.linkedin.com/in/lautaro-camejo-837339247/',
        );
      }
    });

    it('exposes a WhatsApp link with the dev number', () => {
      renderFooter();
      const whatsappLink = screen.getByRole('link', {
        name: /Escribir a Lautaro Camejo por WhatsApp/i,
      });
      expect(whatsappLink).toHaveAttribute(
        'href',
        expect.stringContaining('wa.me/5491156137150'),
      );
    });
  });
});
