import { render, screen } from '@testing-library/react';
import { SectionWrapper } from './SectionWrapper';

describe('SectionWrapper', () => {
  it('renders the title (required)', () => {
    render(
      <SectionWrapper title="Nuestros Servicios">
        <p>Child content</p>
      </SectionWrapper>,
    );
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
  });

  it('renders eyebrow when provided', () => {
    render(
      <SectionWrapper title="Title" eyebrow="¿Qué ofrecemos?">
        <p>Child content</p>
      </SectionWrapper>,
    );
    expect(screen.getByText('¿Qué ofrecemos?')).toBeInTheDocument();
  });

  it('does not render eyebrow when not provided', () => {
    render(
      <SectionWrapper title="Title">
        <p>Child content</p>
      </SectionWrapper>,
    );
    // No eyebrow element should exist
    const eyebrows = screen.queryAllByText(/./);
    const eyebrowElements = eyebrows.filter(
      (el) => el.className.includes('tracking-') && el.className.includes('uppercase'),
    );
    expect(eyebrowElements).toHaveLength(0);
  });

  it('aligns eyebrow with justify-center when titlesAlign is center', () => {
    render(
      <SectionWrapper title="Title" eyebrow="Eyebrow" titlesAlign="center">
        <p>Child content</p>
      </SectionWrapper>,
    );
    const eyebrow = screen.getByText('Eyebrow');
    expect(eyebrow).toHaveClass('justify-center');
    expect(eyebrow).toHaveClass('text-center');
  });

  it('aligns eyebrow with justify-end when titlesAlign is end', () => {
    render(
      <SectionWrapper title="Title" eyebrow="Eyebrow" titlesAlign="end">
        <p>Child content</p>
      </SectionWrapper>,
    );
    const eyebrow = screen.getByText('Eyebrow');
    expect(eyebrow).toHaveClass('justify-end');
    expect(eyebrow).toHaveClass('text-end');
  });

  it('applies text alignment class to the heading', () => {
    render(
      <SectionWrapper title="Title" titlesAlign="center">
        <p>Child content</p>
      </SectionWrapper>,
    );
    const heading = screen.getByRole('heading', { name: 'Title' });
    expect(heading).toHaveClass('text-center');
  });

  it('renders children inside the content area', () => {
    render(
      <SectionWrapper title="Title">
        <p data-testid="child">Child content</p>
      </SectionWrapper>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies custom className to the root', () => {
    const { container } = render(
      <SectionWrapper title="Title" className="custom-class">
        <p>Child</p>
      </SectionWrapper>,
    );
    // Root is the outermost <section>
    const section = container.firstChild;
    expect(section).toHaveClass('custom-class');
  });
});
