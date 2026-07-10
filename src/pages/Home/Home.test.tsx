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

  it('renders the ServicesSection with 2 cards', () => {
    // ServicesSection: eyebrow and title
    expect(screen.getByText('¿Qué ofrecemos?')).toBeInTheDocument();
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();

    // Cards: "Productos" and "Servicios" titles
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();

    // Both cards have CTA buttons
    expect(
      screen.getByRole('button', { name: /ver catálogo/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ver más/i }),
    ).toBeInTheDocument();
  });

  it('renders the reviews section with 3 ReviewCards', () => {
    const reviews = data.Home.Reviews;
    expect(reviews.length).toBe(5); // 5 in data, but only 3 rendered

    // Only the first 3 reviews should render
    for (const review of reviews.slice(0, 3)) {
      expect(screen.getByText(review.title)).toBeInTheDocument();
    }

    // Reviews 4 and 5 should NOT render
    for (const review of reviews.slice(3)) {
      expect(screen.queryByText(review.title)).not.toBeInTheDocument();
    }
  });

  it('renders the AboutSection with data from mock', () => {
    const aboutSection = data.Home.Sections.find((s) => s.kind === 'aboutus');
    if (!aboutSection || aboutSection.kind !== 'aboutus') {
      throw new Error('Expected aboutus section in mock data');
    }

    // Eyebrow and title
    expect(screen.getByText(aboutSection.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(aboutSection.title)).toBeInTheDocument();

    // Content paragraphs
    for (const paragraph of aboutSection.content) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }

    // Highlights
    if (aboutSection.highlights) {
      for (const { value } of aboutSection.highlights) {
        expect(screen.getByText(value)).toBeInTheDocument();
      }
    }

    // CTA
    if (aboutSection.cta) {
      expect(
        screen.getByRole('link', { name: aboutSection.cta.text }),
      ).toBeInTheDocument();
    }
  });

  it('renders the reviews section heading', () => {
    const reviewsSection = data.Home.Sections.find(
      (s) => s.kind === 'reviews',
    );
    if (!reviewsSection || reviewsSection.kind !== 'reviews') {
      throw new Error('Expected reviews section in mock data');
    }
    expect(screen.getByText(reviewsSection.title)).toBeInTheDocument();
  });
});
