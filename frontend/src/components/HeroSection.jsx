import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { gsap, SplitText, EASE, prefersReducedMotion } from '../lib/motion';
import { useUI } from '../context/UIContext';
import heroImage from '../assets/T-shirts/Men/DSC09178_2000x.jpg';

/**
 * Feathers the sharp plate's left and right edges so it dissolves into the
 * fill behind it rather than ending on a hard vertical line.
 */
const EDGE_FADE =
  'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)';

/**
 * Continuation of the studio backdrop either side of the plate.
 *
 * A blurred copy of the photo cannot be used here: it carries a dark, smeared
 * ghost of the subject into the margins. These stops are sampled from the
 * photo's own edge columns instead — #f3f7fa on the left, #dfe3e6 on the
 * right — so the seam matches by measurement, with a soft key light echoing
 * the highlight behind the model and a light vignette at the outer edges.
 */
const STUDIO_FILL = [
  'radial-gradient(75% 55% at 57% 24%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 64%)',
  'linear-gradient(to right, #e2e7ec 0%, #f3f7fa 20%, #edf1f5 50%, #dfe3e6 82%, #d0d5da 100%)',
].join(', ');

const HeroSection = () => {
  const { introDelay } = useUI();

  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const ctaARef = useRef(null);
  const ctaBRef = useRef(null);
  const cueRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(
        [line1Ref.current, line2Ref.current, subRef.current, ctaARef.current, ctaBRef.current, cueRef.current],
        { opacity: 1, y: 0 }
      );
      return undefined;
    }

    let splitA;
    let splitB;

    const ctx = gsap.context(() => {
      // Explicit start state — the intro timeline is delayed behind the
      // preloader, so nothing may show before it runs.
      gsap.set(
        [subRef.current, ctaARef.current, ctaBRef.current, cueRef.current],
        { opacity: 0 }
      );

      splitA = new SplitText(line1Ref.current, { type: 'chars' });
      splitB = new SplitText(line2Ref.current, { type: 'chars' });

      gsap.set([line1Ref.current, line2Ref.current], { opacity: 1 });

      gsap
        .timeline({ delay: introDelay })
        // slow zoom-out on the plate
        .fromTo(bgRef.current, { scale: 1.15 }, { scale: 1, duration: 2, ease: EASE.enter })
        .fromTo(
          splitA.chars,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1, ease: EASE.chars, stagger: 0.025 },
          '-=1.5'
        )
        .fromTo(
          splitB.chars,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1, ease: EASE.chars, stagger: 0.025 },
          '-=0.65'
        )
        .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE.enter }, '-=0.5')
        .fromTo(
          [ctaARef.current, ctaBRef.current],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: EASE.enter, stagger: 0.15 },
          '-=0.4'
        )
        .fromTo(cueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');

      // the plate drifts with the scroll
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: EASE.scrub,
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, sectionRef);

    return () => {
      splitA?.revert();
      splitB?.revert();
      ctx.revert();
    };
  }, [introDelay]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center"
    >
      <div ref={bgRef} className="absolute inset-0 z-0 bg-void">
        {/* The plate is portrait 4:5. At `cover` scale a wide screen crops
            ~60% of it away, so on desktop it is pulled back to 160vh tall —
            showing roughly two thirds of the frame, top-anchored so the head
            stays in shot. STUDIO_FILL continues the backdrop across the width
            the pulled-back plate no longer covers, and the plate's edges are
            feathered into it. Portrait screens take a plain cover, which fits
            without any of this. */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0"
          style={{ background: STUDIO_FILL }}
        />

        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="md:hidden absolute inset-0 w-full h-full object-cover object-[center_top]"
        />

        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-[160vh] w-auto max-w-none"
          style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="max-w-3xl">
          <p className="text-white/50 text-[10px] tracking-eyebrow uppercase mb-6 sm:mb-8">
            Autumn / Winter {new Date().getFullYear()}
          </p>

          <h1 className="font-playfair text-white font-light leading-[0.95] text-[clamp(2.75rem,9vw,7.5rem)]">
            <span className="split-line">
              <span ref={line1Ref} className="block">
                Dressed for
              </span>
            </span>
            <span className="split-line">
              <span ref={line2Ref} className="block italic">
                the long run.
              </span>
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-7 sm:mt-9 max-w-md text-white/60 text-sm sm:text-base font-light leading-relaxed"
          >
            Considered pieces in honest fabrics, cut in small runs. Made to be worn until they
            look like yours.
          </p>

          <div className="mt-9 sm:mt-12 flex flex-wrap items-center gap-4">
            <Link
              ref={ctaARef}
              to="/latest"
              className="h-12 px-9 bg-white text-black text-[10px] tracking-button uppercase font-medium flex items-center justify-center hover:bg-secondary transition-colors duration-300"
            >
              Shop the Collection
            </Link>
            <Link
              ref={ctaBRef}
              to="/aboutus"
              className="h-12 px-9 border border-white/30 text-white text-[10px] tracking-button uppercase font-medium flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={cueRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="block w-px h-10 bg-white/15 overflow-hidden relative">
          <span className="absolute inset-x-0 top-0 h-1/3 bg-white/70 animate-scroll-down" />
        </span>
        <ArrowDown size={12} strokeWidth={1.5} className="text-white/30" />
      </div>
    </section>
  );
};

export default HeroSection;
