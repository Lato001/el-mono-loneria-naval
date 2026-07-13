import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  function mockMatchMedia(matches: boolean) {
    let listener: ((e: MediaQueryListEvent) => void) | null = null;

    const mql = {
      matches,
      media: "(max-width: 767px)",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: vi.fn((_: string, cb: (e: MediaQueryListEvent) => void) => {
        listener = cb;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: () => false,
    };

    window.matchMedia = vi.fn().mockReturnValue(mql);
    return {
      mql,
      fireChange: (newMatches: boolean) => {
        listener?.({ matches: newMatches } as MediaQueryListEvent);
      },
    };
  }

  it("returns initial match state (false)", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(false);
  });

  it("returns true when media query matches on mount", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(true);
  });

  it("updates when media query changes", () => {
    const { fireChange } = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));

    expect(result.current).toBe(false);

    act(() => {
      fireChange(true);
    });

    expect(result.current).toBe(true);
  });

  it("cleans up event listener on unmount", () => {
    const { mql } = mockMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery("(max-width: 767px)"));

    unmount();
    expect(mql.removeEventListener).toHaveBeenCalled();
  });
});
