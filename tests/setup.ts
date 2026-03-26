import "@testing-library/jest-dom";

// Mock IntersectionObserver for jsdom (used by framer-motion's useInView)
const mockIntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

globalThis.IntersectionObserver =
  mockIntersectionObserver as unknown as typeof IntersectionObserver;
