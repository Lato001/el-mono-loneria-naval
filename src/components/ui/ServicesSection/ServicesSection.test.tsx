import { render, screen } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';

describe('ServicesSection', () => {
  it('renders the title (required)', () => {
    render(
      <ServicesSection title="Nuestros Servicios">
        <p>Child content</p>
      </ServicesSection>,
    );
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
  });

  it('renders eyebrow when provided', () => {
    render(
      <ServicesSection title="Title" eyebrow="¿Qué ofrecemos?">
        <p>Child content</p>
      </ServicesSection>,
    );
    expect(screen.getByText('¿Qué ofrecemos?')).toBeInTheDocument();
  });

  it('does not render eyebrow when not provided', () => {
    render(
      <ServicesSection title="Title">
        <p>Child content</p>
      </ServicesSection>,
    );
    // No eyebrow element should exist
    const eyebrows = screen.queryAllByText(/./);
    const eyebrowElements = eyebrows.filter(
      (el) => el.className.includes('tracking-') && el.className.includes('uppercase'),
    );
    expect(eyebrowElements).toHaveLength(0);
  });

  it('renders icon when icon prop is provided', () => {
    render(
      <ServicesSection title="Title" icon="/test-icon.png">
        <p>Child content</p>
      </ServicesSection>,
    );
    const icon = screen.getByAltText('');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe('IMG');
    expect(icon).toHaveAttribute('src', '/test-icon.png');
  });

  it('does NOT render icon element when icon prop is absent', () => {
    render(
      <ServicesSection title="Title">
        <p>Child content</p>
      </ServicesSection>,
    );
    // No <img> should exist in the section
    const images = screen.queryAllByRole('img');
    expect(images).toHaveLength(0);
  });

  it('renders children inside the content area', () => {
    render(
      <ServicesSection title="Title">
        <p data-testid="child">Child content</p>
      </ServicesSection>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies custom className to the root', () => {
    const { container } = render(
      <ServicesSection title="Title" className="custom-class">
        <p>Child</p>
      </ServicesSection>,
    );
    // Root is the outermost <section>
    const section = container.firstChild;
    expect(section).toHaveClass('custom-class');
  });
});
