import { renderHook, act } from "@testing-library/react";
import { useFadeInOnView } from "./useFadeInOnView";
import { createSpyObserver } from "../test/helpers";

describe("useFadeInOnView", () => {
  it("returns ref and visible=false initially", () => {
    const spy = createSpyObserver();
    globalThis.IntersectionObserver = spy.MockClass as unknown as typeof IntersectionObserver;

    const { result } = renderHook(() => useFadeInOnView<HTMLDivElement>());

    expect(result.current.ref).toBeDefined();
    expect(result.current.visible).toBe(false);
  });

  it("sets visible=true when element enters viewport", () => {
    const spy = createSpyObserver();
    globalThis.IntersectionObserver = spy.MockClass as unknown as typeof IntersectionObserver;

    const { result } = renderHook(() => {
      const hook = useFadeInOnView<HTMLDivElement>();
      // Attach a real DOM element so the observer has something to observe
      if (hook.ref.current === null) {
        (hook.ref as { current: HTMLDivElement | null }).current = document.createElement("div");
      }
      return hook;
    });

    act(() => {
      spy.trigger(true);
    });

    expect(result.current.visible).toBe(true);
  });

  it("unobserves after first hit when once=true (default)", () => {
    const spy = createSpyObserver();
    globalThis.IntersectionObserver = spy.MockClass as unknown as typeof IntersectionObserver;

    const { result } = renderHook(() => {
      const hook = useFadeInOnView<HTMLDivElement>({ once: true });
      if (hook.ref.current === null) {
        (hook.ref as { current: HTMLDivElement | null }).current = document.createElement("div");
      }
      return hook;
    });

    act(() => {
      spy.trigger(true);
    });

    expect(result.current.visible).toBe(true);
    // After once=true + intersection, element should be unobserved
    expect(spy.observed.length).toBe(0);
  });
});
