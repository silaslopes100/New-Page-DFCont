import { useEffect, useRef } from 'react';

const OBSERVER_SELECTOR =
  '.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-stagger';

export const useScrollAnimation = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const observeElement = (el) => {
      if (el && !el.classList.contains('visible')) observer.observe(el);
    };

    const observeAll = () => {
      document.querySelectorAll(OBSERVER_SELECTOR).forEach(observeElement);
    };

    // Elements added after mount (e.g. cards re-created when switching the
    // Plans tab) would otherwise stay at opacity: 0 forever.
    const mutationObserver = new MutationObserver((mutations) => {
      let needsScan = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches && node.matches(OBSERVER_SELECTOR)) needsScan = true;
          if (node.querySelectorAll && node.querySelectorAll(OBSERVER_SELECTOR).length) {
            needsScan = true;
          }
        });
      });
      if (needsScan) observeAll();
    });

    observeAll();
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return elementRef;
};