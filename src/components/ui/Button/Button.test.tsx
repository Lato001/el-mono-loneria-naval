import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './Button';

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, { wrapper: MemoryRouter });
}

describe('Button', () => {
  it('renders children', () => {
    renderWithRouter(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as <button> when no href is provided', () => {
    renderWithRouter(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: /click/i })).toBeInTheDocument();
  });

  it('renders as <Link> when href is provided', () => {
    renderWithRouter(<Button href="/test">Go</Button>);
    const link = screen.getByRole('link', { name: /go/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies correct classes for each variant', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Button variant="primary">Btn</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toHaveClass('bg-white');

    rerender(
      <MemoryRouter>
        <Button variant="secondary">Btn</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toHaveClass('bg-pr-aquamarine');

    rerender(
      <MemoryRouter>
        <Button variant="outline">Btn</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toHaveClass('border-2');

    rerender(
      <MemoryRouter>
        <Button variant="ghost">Btn</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toHaveClass('hover:underline');
  });

  it('applies correct classes for each size', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Button size="sm">Btn</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toHaveClass('px-3');

    rerender(
      <MemoryRouter>
        <Button size="md">Btn</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toHaveClass('px-5');

    rerender(
      <MemoryRouter>
        <Button size="lg">Btn</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toHaveClass('px-7');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithRouter(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('renders as <span> when disabled with href', () => {
    renderWithRouter(
      <Button href="/test" disabled>
        Disabled Link
      </Button>,
    );
    const el = screen.getByText('Disabled Link');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });

  it('has aria-disabled when disabled in button mode', () => {
    renderWithRouter(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button', { name: /disabled/i });
    expect(btn).toBeDisabled();
  });

  it('forwards className to the rendered element', () => {
    renderWithRouter(<Button className="custom-class">Styled</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
