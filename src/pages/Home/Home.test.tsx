import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { data } from '../../mocks/data';

describe('Home page', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
  });

  it('renders the Hero section', () => {
    // Hero default primaryCta is "Solicitar presupuesto"
    expect(
      screen.getByRole('link', { name: /solicitar presupuesto/i }),
    ).toBeInTheDocument();
  });

  it('renders the Hero secondary CTA', () => {
    // Hero default secondaryCta is "Ver servicios"
    expect(
      screen.getByRole('link', { name: /^ver servicios$/i }),
    ).toBeInTheDocument();
  });

  it('renders the BrandMarquee with brand images', () => {
    // BrandMarquee renders img elements with brand alt text
    // Marquee duplicates items (multiplier >= 2), so use getAllByAltText
    const sauledaImages = screen.getAllByAltText('Sauleda');
    const sunbrellaImages = screen.getAllByAltText('Sunbrella');
    expect(sauledaImages.length).toBeGreaterThanOrEqual(1);
    expect(sunbrellaImages.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the SectionWrapper with 2 cards', () => {
    // SectionWrapper: eyebrow and title
    expect(screen.getByText('¿Qué ofrecemos?')).toBeInTheDocument();
    expect(screen.getByText('Encontrá lo que buscas')).toBeInTheDocument();

    // ImgCards: "Productos" and "Servicios" titles
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
  });

  it('renders the reviews section with 3 ReviewCards', () => {
    const reviews = data.Home.Reviews;
    expect(reviews).toHaveLength(3);

    // All 3 reviews from the mock should render
    for (const review of reviews) {
      expect(screen.getByText(review.title)).toBeInTheDocument();
    }
  });

  it('renders the About section wrapper', () => {
    // SectionWrapper of About is mounted with AboutWork inside
    expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Trabajos a Medida')).toBeInTheDocument();
  });

  it('renders the reviews section heading', () => {
    // SectionWrapper of Reviews heading
    expect(screen.getByText('Testimonios')).toBeInTheDocument();
    expect(screen.getByText('Nuestros Clientes')).toBeInTheDocument();
  });
});
