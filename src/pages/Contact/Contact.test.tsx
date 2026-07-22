import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, it, expect } from 'vitest';
import { Contact } from './Contact';
import { data } from '../../mocks/data';

const WHATSAPP_URL = 'https://wa.me/123';

describe('Contact page', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function renderContact() {
    return render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
  }

  it('renders SectionHero with the correct title and description', () => {
    vi.stubEnv('VITE_WHATSAPP_URL', WHATSAPP_URL);
    renderContact();

    expect(
      screen.getByRole('heading', { level: 1, name: /hablemos de tu proyecto/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/estamos disponibles para responder tus consultas/i),
    ).toBeInTheDocument();
  });

  it('renders all 3 contact info items from data.nav.footer.contact', () => {
    vi.stubEnv('VITE_WHATSAPP_URL', WHATSAPP_URL);
    renderContact();

    const contactItems = data.nav.footer.contact;
    expect(contactItems).toHaveLength(3);

    for (const item of contactItems) {
      // Each label (Teléfono, Email, Dirección) should be visible
      expect(screen.getByText(item.label)).toBeInTheDocument();
      // Each value should be visible
      expect(screen.getByText(item.value)).toBeInTheDocument();
    }
  });

  it('renders contact info items as clickable links with correct hrefs', () => {
    vi.stubEnv('VITE_WHATSAPP_URL', WHATSAPP_URL);
    renderContact();

    const contactItems = data.nav.footer.contact;
    for (const item of contactItems) {
      const link = screen.getByText(item.value).closest('a');
      expect(link).toHaveAttribute('href', item.href);
    }
  });

  it('renders the WhatsApp CTA with the correct href from env', () => {
    vi.stubEnv('VITE_WHATSAPP_URL', WHATSAPP_URL);
    renderContact();

    const whatsappLink = screen.getByRole('link', {
      name: /contactar por whatsapp/i,
    });
    expect(whatsappLink).toHaveAttribute('href', WHATSAPP_URL);
  });

  it('renders the WhatsApp CTA that opens in a new tab', () => {
    vi.stubEnv('VITE_WHATSAPP_URL', WHATSAPP_URL);
    renderContact();

    const whatsappLink = screen.getByRole('link', {
      name: /contactar por whatsapp/i,
    });
    expect(whatsappLink).toHaveAttribute('target', '_blank');
    expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
