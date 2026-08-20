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
    // Hero primary CTA comes from data.home.hero.primaryCta
    expect(
      screen.getByRole('link', { name: /^ver productos$/i }),
    ).toBeInTheDocument();
  });

  it('renders the Hero secondary CTA', () => {
    expect(
      screen.getByRole('link', { name: /^ver trabajos$/i }),
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

    // ImgCards: "Productos" and "Trabajos" titles.
    // "Productos" also appears in the NextPageCta label at the bottom of the
    // route (which points to /productos), so use getAllByText and assert >=1.
    expect(screen.getAllByText('Productos').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Trabajos')).toBeInTheDocument();
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
