import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = global.IntersectionObserver || IntersectionObserverMock;
global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

if (window.HTMLMediaElement) {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.HTMLMediaElement.prototype.load = vi.fn();
}