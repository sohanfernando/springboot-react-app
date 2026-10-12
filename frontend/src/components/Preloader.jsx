import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useUI } from '../context/UIContext';

/**
 * Full-screen curtain, once per session. The counter is theatre — it measures
 * nothing — but the timing is tuned so the curtain clears at ~2.3s, which is
 * exactly when the hero timeline starts.
 */
const Preloader = () => {
  const { preloaderSeen, markPreloaderDone } = useUI();
  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(preloaderSeen);

  const panelRef = useRef(null);
  const titleRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (preloaderSeen) markPreloaderDone();
  }, [preloaderSeen, markPreloaderDone]);

  useLayoutEffect(() => {
    if (preloaderSeen) return undefined;

    if (prefersReducedMotion()) {
      setHidden(true);
      markPreloaderDone();
      return undefined;
    }

    let value = 0;
    const interval = window.setInterval(() => {
      value += Math.floor(Math.random() * 15) + 5;
      if (value >= 100) {
        value = 100;
        window.clearInterval(interval);
      }
      setCount(value);
    }, 60);

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power2.inOut', transformOrigin: 'left' },
          '-=0.3'
        )
        .call(() => {
          window.clearInterval(interval);
          setCount(100);
        })
        .to(titleRef.current, { y: -20, opacity: 0, duration: 0.4, ease: 'power3.in' }, '+=0.1')
        .to(panelRef.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
        .call(() => {
          markPreloaderDone();
          setHidden(true);
        });
    }, panelRef);

    return () => {
      window.clearInterval(interval);
      ctx.revert();
    };
  }, [preloaderSeen, markPreloaderDone]);

  if (hidden) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void overflow-hidden"
    >
      <div className="text-center px-6">
        <h1
          ref={titleRef}
          className="font-playfair text-white text-5xl sm:text-6xl md:text-8xl tracking-[0.3em] font-light"
        >
          FASHIONHUB
        </h1>
        <p className="text-white/40 text-[10px] sm:text-xs tracking-eyebrow mt-4 uppercase">
          Luxury Fashion
        </p>
      </div>

      <div className="absolute bottom-10 sm:bottom-16 left-0 right-0 px-6 sm:px-16">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white/30 text-[10px] sm:text-xs tracking-widest uppercase">Loading</span>
          <span className="text-white/60 text-[10px] sm:text-xs tracking-widest tabular-nums">
            {String(count).padStart(3, '0')}
          </span>
        </div>
        <div className="w-full h-px bg-white/10">
          <div
            ref={barRef}
            className="h-full bg-white origin-left"
            style={{ transform: 'scaleX(0)', width: `${count}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
