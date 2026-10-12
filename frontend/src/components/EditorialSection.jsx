import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, EASE, parallax, showNow, whenInView, prefersReducedMotion } from '../lib/motion';
import promoVideo from '../assets/Videos/1.mp4';
import plateA from '../assets/T-shirts/Men/770198ca22bbf9adec7722c52e89e1d3b9896138_2000x.jpg';

/**
 * The manifesto. Two plates drift at different rates against each other,
 * which is what reads as depth — the parallax budget here is -15 / +10.
 */
const EditorialSection = () => {
  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const plateRef = useRef(null);
  const videoRef = useRef(null);
  const bodyRef = useRef(null);
  const ruleRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      showNow([
        headingRef.current,
        plateRef.current,
        videoRef.current,
        bodyRef.current,
        ruleRef.current,
      ]);
      return undefined;
    }

    let split;
    let stopWatching = () => {};

    const ctx = gsap.context(() => {
      // Explicit start state — deterministic, and applied before first paint.
      gsap.set([plateRef.current, videoRef.current, bodyRef.current], { opacity: 0 });
      gsap.set(headingRef.current, { opacity: 0 });
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left' });

      const tl = gsap.timeline({ paused: true });
      stopWatching = whenInView(rootRef.current, () => tl.play());

      split = new SplitText(headingRef.current, { type: 'chars' });
      gsap.set(headingRef.current, { opacity: 1 });

      tl.fromTo(
        split.chars,
        { y: '110%', opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: EASE.chars, stagger: 0.02 }
      )
        .fromTo(plateRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: EASE.enter }, '-=0.8')
        .fromTo(videoRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: EASE.enter }, '-=0.9')
        .fromTo(bodyRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE.enter }, '-=0.5')
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: EASE.draw, transformOrigin: 'left' },
          '-=0.6'
        );

      parallax(plateRef.current, { yPercent: -15, scrub: 1.5, trigger: rootRef.current });
      parallax(videoRef.current, { yPercent: 10, scrub: 2, trigger: rootRef.current });
    }, rootRef);

    return () => {
      stopWatching();
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="py-24 md:py-40 bg-white overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Copy */}
          <div className="lg:col-span-5 lg:pt-16">
            <p className="text-[10px] tracking-eyebrow uppercase text-black/30 mb-6">The House</p>

            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-light leading-[1.08]">
              <span className="split-line">
                <span ref={headingRef} className="block">
                  Fewer things, better made.
                </span>
              </span>
            </h2>

            <div ref={bodyRef} className="mt-8 max-w-md">
              <p className="text-sm leading-relaxed text-black/55 mb-5">
                We work in short runs with mills we have visited, on patterns we have worn
                ourselves for a season before they go on sale. Nothing ships because a calendar
                said so.
              </p>
              <p className="text-sm leading-relaxed text-black/55">
                The result is a smaller catalogue than most, and pieces that keep earning their
                place in it.
              </p>

              <Link
                to="/aboutus"
                className="inline-block mt-8 text-[11px] tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors duration-300 pb-0.5 border-b border-transparent hover:border-black"
              >
                Read our story &rarr;
              </Link>
            </div>

            <div ref={ruleRef} className="mt-10 h-px w-full bg-line origin-left" />

            <p className="mt-8 md:mt-10 font-playfair text-[clamp(2.5rem,6vw,7rem)] text-secondary leading-none font-light select-none">
              {new Date().getFullYear()}
            </p>
          </div>

          {/* Plates */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div ref={plateRef} className="sm:mt-12">
              <div className="relative overflow-hidden bg-muted aspect-[3/4]">
                <img
                  src={plateA}
                  alt="Studio detail"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <p className="mt-3 text-[9px] tracking-[0.3em] uppercase text-black/30">Plate I — Fabric</p>
            </div>

            <div ref={videoRef}>
              <div className="relative overflow-hidden bg-void aspect-[3/4]">
                <video
                  src={promoVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>
              <p className="mt-3 text-[9px] tracking-[0.3em] uppercase text-black/30">Plate II — In motion</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
