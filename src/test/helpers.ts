/**
 * Captures IntersectionObserver callbacks so tests can trigger visibility manually.
 * Usage in tests:
 *   const callbacks = createObserverMock();
 *   // render component that uses IntersectionObserver
 *   triggerIntersection(callbacks, 0, true); // trigger first observer's callback
 */
export function createObserverMock() {
  const callbacks: Array<(entries: Partial<IntersectionObserverEntry>[]) => void> = [];

  const MockClass = class {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: readonly number[] = [];

    constructor(_cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
      callbacks.push(_cb);
    }

    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };

  return {
    MockClass,
    callbacks,
  };
}

/**
 * Trigger an intersection entry on a captured observer callback.
 */
export function triggerIntersection(
  callbacks: Array<(entries: Partial<IntersectionObserverEntry>[]) => void>,
  index: number,
  isIntersecting: boolean,
  target?: Element,
) {
  const cb = callbacks[index];
  if (!cb) throw new Error(`No observer callback at index ${index}`);
  cb([{ isIntersecting, target, intersectionRatio: isIntersecting ? 1 : 0 }]);
}

/**
 * Spy-friendly IntersectionObserver that records observed elements.
 */
export function createSpyObserver() {
  const observed: Element[] = [];
  let callback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null = null;

  const MockClass = class {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: readonly number[] = [];

    constructor(cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
      callback = cb;
    }

    observe(el: Element) {
      observed.push(el);
    }
    unobserve(el: Element) {
      const idx = observed.indexOf(el);
      if (idx >= 0) observed.splice(idx, 1);
    }
    disconnect() {
      observed.length = 0;
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };

  return {
    MockClass,
    observed,
    getCallback: () => callback,
    trigger(isIntersecting: boolean) {
      if (!callback) throw new Error("No observer created yet");
      const target = observed[0];
      callback([{ isIntersecting, target, intersectionRatio: isIntersecting ? 1 : 0 }]);
    },
  };
}
