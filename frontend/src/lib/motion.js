import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Re-exported so storefront components can keep a single import.
export { formatPrice, getImageUrl } from './format';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

/**
 * The four easings the whole system uses. Nothing else.
 *  power4.out    — character reveals
 *  power3.out    — everything that enters
 *  power2.inOut  — rules and bars drawing
 *  none          — every scrub / parallax
 */
export const EASE = {
  chars: 'power4.out',
  enter: 'power3.out',
  draw: 'power2.inOut',
  scrub: 'none',
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fire `callback` the first time `el` is on screen.
 *
 * Anything that decides whether content is VISIBLE uses this rather than
 * ScrollTrigger. ScrollTrigger caches each trigger's scroll position when it
 * is created, and this page grows by thousands of pixels after its product
 * rails finish fetching — stale positions there mean a reveal silently never
 * runs and the section stays blank. IntersectionObserver caches nothing, so
 * layout growth cannot invalidate it. ScrollTrigger is still the right tool
 * for scrub/parallax below, where a bad measurement is a slightly-off effect
 * rather than missing content.
 */
export function whenInView(el, callback, { rootMargin = '0px 0px -12% 0px' } = {}) {
  if (!el) return () => {};

  if (typeof IntersectionObserver === 'undefined') {
    callback();
    return () => {};
  }

  let fired = false;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // isIntersecting covers scrolling in; a bottom above the viewport
        // covers the case where we are already past it.
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          if (fired) return;
          fired = true;
          observer.disconnect();
          callback();
          return;
        }
      }
    },
    { rootMargin, threshold: 0 }
  );

  observer.observe(el);
  return () => observer.disconnect();
}

/**
 * The reveal. Six-plus sections use this one function with only the stagger
 * changed — the coherence comes from repeating it, not from inventing variants.
 */
export function reveal(target, { stagger = 0.12, y = 60, duration = 0.9, trigger } = {}) {
  const els = gsap.utils.toArray(target);
  if (!els.length) return null;

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0 });
    return null;
  }

  gsap.set(els, { opacity: 0, y });

  return whenInView(trigger || els[0], () => {
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration,
      ease: EASE.enter,
      stagger,
      overwrite: 'auto',
    });
  });
}

/**
 * Force elements to their finished state. Components that hide content with
 * an inline `opacity: 0` before animating it must call this on the
 * reduced-motion path, or that content never becomes visible.
 */
export function showNow(target) {
  const els = gsap.utils.toArray(target).filter(Boolean);
  if (!els.length) return;
  gsap.set(els, { opacity: 1, y: 0, scale: 1, scaleX: 1, clearProps: 'transform' });
}

/** A hairline rule drawing itself out from the left. */
export function drawLine(target, { duration = 1.2, trigger } = {}) {
  const els = gsap.utils.toArray(target);
  if (!els.length) return null;

  if (prefersReducedMotion()) {
    gsap.set(els, { scaleX: 1 });
    return null;
  }

  gsap.set(els, { scaleX: 0, transformOrigin: 'left' });

  return whenInView(trigger || els[0], () => {
    gsap.to(els, {
      scaleX: 1,
      duration,
      ease: EASE.draw,
      transformOrigin: 'left',
      overwrite: 'auto',
    });
  });
}

/**
 * Split an element into characters and raise them out of an overflow mask.
 * Returns the SplitText instance so the caller can revert() it on cleanup.
 */
export function revealChars(el, { stagger = 0.025, start = 'top 75%', delay = 0, timeline } = {}) {
  if (!el) return null;

  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1 });
    return null;
  }

  const split = new SplitText(el, { type: 'chars', charsClass: 'v-char' });
  gsap.set(el, { opacity: 1 });

  const vars = {
    y: '0%',
    opacity: 1,
    duration: 1,
    ease: EASE.chars,
    stagger,
  };
  const from = { y: '110%', opacity: 0 };

  if (timeline) {
    timeline.fromTo(split.chars, from, vars, delay ? `+=${delay}` : undefined);
  } else {
    gsap.fromTo(split.chars, from, {
      ...vars,
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    });
  }

  return split;
}

/**
 * Scroll-linked drift. Negative yPercent moves against the scroll, positive
 * with it. Heavier scrub reads as more distance.
 */
export function parallax(target, { yPercent = -12, scrub = 1.5, trigger } = {}) {
  const els = gsap.utils.toArray(target);
  if (!els.length || prefersReducedMotion()) return;

  els.forEach((el) => {
    gsap.to(el, {
      yPercent,
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: trigger || el.parentElement || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
        invalidateOnRefresh: true,
      },
    });
  });
}
