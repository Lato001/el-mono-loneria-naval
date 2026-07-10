import { render, screen } from '@testing-library/react';
import { HomeSection } from './HomeSection';

describe('HomeSection', () => {
  it('renders the eyebrow and title', () => {
    render(<HomeSection eyebrow="Test eyebrow" title="Test Title" />);
    expect(screen.getByText('Test eyebrow')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <HomeSection eyebrow="Eyebrow" title="Title">
        <p data-testid="child">Child content</p>
      </HomeSection>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does NOT add text-center when centerTitleOnMobile is absent (default)', () => {
    const { container } = render(
      <HomeSection eyebrow="Eyebrow" title="Title" />,
    );
    // The title container is the <div> wrapping eyebrow + title
    // Find the h2 title element and check its parent
    const title = screen.getByText('Title');
    const titleWrapper = title.parentElement;
    expect(titleWrapper).not.toHaveClass('text-center');
    // Also check the container div (parent of eyebrow+title wrapper)
    const outerDiv = container.querySelector('.flex');
    // The inner div containing eyebrow+title should NOT have text-center
    const innerDiv = outerDiv?.querySelector('div:not(.flex)');
    if (innerDiv) {
      expect(innerDiv).not.toHaveClass('text-center');
    }
  });

  it('adds text-center md:text-left when centerTitleOnMobile is true', () => {
    render(
      <HomeSection eyebrow="Eyebrow" title="Title" centerTitleOnMobile />,
    );
    const title = screen.getByText('Title');
    const titleWrapper = title.parentElement;
    expect(titleWrapper).toHaveClass('text-center');
    expect(titleWrapper).toHaveClass('md:text-left');
  });
});
