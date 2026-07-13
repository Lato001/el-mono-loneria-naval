import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutSection } from './AboutSection';

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, { wrapper: MemoryRouter });
}

const defaultProps = {
  content: [
    'First paragraph about the workshop.',
    'Second paragraph about the techniques.',
  ],
};

describe('AboutSection', () => {
  it('renders the eyebrow and title when provided', () => {
    renderWithRouter(
      <AboutSection
        {...defaultProps}
        eyebrow="Sobre nosotros"
        title="Pasión por el oficio"
      />,
    );
    expect(screen.getByText('Sobre nosotros')).toBeInTheDocument();
    expect(screen.getByText('Pasión por el oficio')).toBeInTheDocument();
  });

  it('does not render eyebrow or title when not provided', () => {
    renderWithRouter(<AboutSection {...defaultProps} />);
    expect(screen.queryByText('Sobre nosotros')).not.toBeInTheDocument();
    expect(screen.queryByText('Pasión por el oficio')).not.toBeInTheDocument();
  });

  it('renders custom eyebrow and title', () => {
    renderWithRouter(
      <AboutSection
        {...defaultProps}
        eyebrow="Custom eyebrow"
        title="Custom title"
      />,
    );
    expect(screen.getByText('Custom eyebrow')).toBeInTheDocument();
    expect(screen.getByText('Custom title')).toBeInTheDocument();
  });

  it('renders all content paragraphs', () => {
    renderWithRouter(<AboutSection {...defaultProps} />);
    expect(
      screen.getByText('First paragraph about the workshop.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Second paragraph about the techniques.'),
    ).toBeInTheDocument();
  });

  it('renders the highlights grid when provided', () => {
    const highlights = [
      { label: 'Years', value: '+20' },
      { label: 'Projects', value: '+500' },
      { label: 'Clients', value: '+300' },
    ];

    renderWithRouter(<AboutSection {...defaultProps} highlights={highlights} />);

    expect(screen.getByText('+20')).toBeInTheDocument();
    expect(screen.getByText('+500')).toBeInTheDocument();
    expect(screen.getByText('+300')).toBeInTheDocument();
    expect(screen.getByText('Years')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
  });

  it('does not render highlights when not provided', () => {
    renderWithRouter(<AboutSection {...defaultProps} highlights={[]} />);
    // No highlight values should be present
    expect(screen.queryByText('+20')).not.toBeInTheDocument();
  });

  it('renders the CTA button with correct href when provided', () => {
    const cta = { text: 'Learn more', href: '/about' };

    renderWithRouter(<AboutSection {...defaultProps} cta={cta} />);

    const ctaLink = screen.getByRole('link', { name: /learn more/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/about');
  });

  it('does not render CTA when not provided', () => {
    renderWithRouter(<AboutSection {...defaultProps} />);
    // No CTA link should exist
    expect(
      screen.queryByRole('link', { name: /learn more/i }),
    ).not.toBeInTheDocument();
  });

  it('renders placeholder when no media is provided', () => {
    renderWithRouter(<AboutSection {...defaultProps} images={[]} />);
    expect(screen.getByText('Imagen pendiente')).toBeInTheDocument();
  });

  it('does not render img element when no media is provided', () => {
    renderWithRouter(<AboutSection {...defaultProps} images={[]} />);
    const images = screen.queryAllByRole('img');
    expect(images).toHaveLength(0);
  });

  it('renders img element with correct alt when image is provided', () => {
    renderWithRouter(
      <AboutSection
        {...defaultProps}
        images={[]}
        image="https://example.com/photo.jpg"
        imageAlt="Workshop photo"
      />,
    );
    const img = screen.getByAltText('Workshop photo');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });
});
