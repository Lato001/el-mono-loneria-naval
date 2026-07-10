import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, { wrapper: MemoryRouter });
}

describe('Footer', () => {
  beforeEach(() => {
    renderWithRouter(<Footer />);
  });

  it('renders the logo image', () => {
    const logo = screen.getByAltText('El Mono — Lonería Naval');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('IMG');
  });

  it('renders 4 navigation group titles', () => {
    const groupTitles = ['Servicios', 'Productos', 'Nosotros', 'Ayuda'];
    for (const title of groupTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('renders placeholder sub-links in each nav group', () => {
    const expectedLinks = [
      'Lonas a Medida',
      'Capotas para Embarcaciones',
      'Cubreautos y Fundas',
      'Catálogo',
      'Sobre el Taller',
      'Equipo',
      'FAQ',
      'Contacto',
    ];

    for (const label of expectedLinks) {
      const link = screen.getByRole('link', { name: label });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
    }
  });

  it('renders nav sub-links as Link components (not raw <a> tags with full reload)', () => {
    // Link from react-router-dom renders <a> in the DOM, but with the correct href
    // Verify that the placeholder sub-links have the right hrefs
    const lonasLink = screen.getByRole('link', { name: 'Lonas a Medida' });
    expect(lonasLink).toHaveAttribute('href', '/servicios/lonas-a-medida');

    const catalogoLink = screen.getByRole('link', { name: 'Catálogo' });
    expect(catalogoLink).toHaveAttribute('href', '/productos');

    const faqLink = screen.getByRole('link', { name: 'FAQ' });
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  it('renders phone contact item with tel: href', () => {
    const phoneLink = screen.getByText('+54 9 11 0000-0000');
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+5491100000000');
  });

  it('renders email contact item with mailto: href', () => {
    const emailLink = screen.getByText('contacto@elmono.com.ar');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest('a')).toHaveAttribute(
      'href',
      'mailto:contacto@elmono.com.ar',
    );
  });

  it('renders address contact item', () => {
    expect(screen.getByText('Buenos Aires, Argentina')).toBeInTheDocument();
  });

  it('renders the copyright text', () => {
    expect(
      screen.getByText(/2026 El Mono Lonería Naval/),
    ).toBeInTheDocument();
  });

  it('renders social links', () => {
    expect(
      screen.getByRole('link', { name: 'Facebook' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Instagram' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'WhatsApp' }),
    ).toBeInTheDocument();
  });
});
