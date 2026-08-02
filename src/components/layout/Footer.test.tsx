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
});
