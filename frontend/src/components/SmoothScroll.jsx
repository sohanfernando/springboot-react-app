import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

/**
 * Lenis is driven by the GSAP ticker rather than its own rAF loop — two
 * independent loops drift a frame apart, which shows up as jitter on every
 * scrubbed animation. lagSmoothing(0) then stops GSAP compensating for
 * dropped frames, which would otherwise jump scrubbed values.
 */
const SmoothScroll = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      orientation: 'vertical',
      smoothWheel: true,
    });

    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  /**
   * ScrollTrigger records each trigger's scroll position when it is created.
   * Most of this site's content arrives from a fetch after mount, so the page
   * grows by thousands of pixels afterwards and every one of those recorded
   * positions goes stale — reveals below the fold then never fire and their
   * content stays at opacity 0. Watching the document height and refreshing
   * keeps the measurements honest without each section having to know when
   * its neighbours finished loading.
   */
  useEffect(() => {
    let frame = null;
    const scheduleRefresh = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const observer = new ResizeObserver(scheduleRefresh);
    observer.observe(document.body);

    window.addEventListener('load', scheduleRefresh);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', scheduleRefresh);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Every route change starts at the top and re-measures the triggers that
  // the new page just mounted.
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return children;
};

export default SmoothScroll;
