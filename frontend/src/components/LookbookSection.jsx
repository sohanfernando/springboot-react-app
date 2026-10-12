import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap, EASE, parallax, showNow, whenInView, prefersReducedMotion } from '../lib/motion';
import { SectionHeader } from './ui/Primitives';

import look1 from '../assets/Shirts/13.webp';
import look2 from '../assets/Dresses/4.webp';
import look3 from '../assets/Joggers & Pants/Men/12.webp';
import look4 from '../assets/T-shirts/Women/6.webp';

const LOOKS = [
  { src: look1, label: 'Look 01', span: 'md:col-span-7', ratio: 'aspect-[4/5]' },
  { src: look2, label: 'Look 02', span: 'md:col-span-5 md:mt-20', ratio: 'aspect-[3/4]' },
  { src: look3, label: 'Look 03', span: 'md:col-span-5', ratio: 'aspect-[3/4]' },
  { src: look4, label: 'Look 04', span: 'md:col-span-7 md:mt-20', ratio: 'aspect-[4/5]' },
];

/**
 * Editorial imagery with no product meta attached — the page needs one block
 * that is only about how the clothes look, not what they cost.
 */
const LookbookSection = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      showNow(rootRef.current?.querySelectorAll('.lookbook-img'));
      return undefined;
    }

    let stopWatching = () => {};

    const ctx = gsap.context(() => {
      const plates = gsap.utils.toArray('.lookbook-img');
      gsap.set(plates, { opacity: 0, scale: 1.05 });

      stopWatching = whenInView(rootRef.current, () => {
        gsap.to(plates, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: EASE.enter,
          stagger: 0.15,
          overwrite: 'auto',
        });
      });

      parallax('.lookbook-inner', { yPercent: -8, scrub: 1.5 });
    }, rootRef);

    return () => {
      stopWatching();
      ctx.revert();
    };
  }, []);

  return (
    <section id="lookbook" className="py-24 md:py-36 bg-void overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader
          eyebrow="The Lookbook"
          title="Season's final chapter"
          action="Shop the looks"
          actionTo="/latest"
          onDark
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {LOOKS.map((look) => (
            <figure key={look.label} className={`lookbook-img ${look.span}`}>
              <div className={`relative overflow-hidden bg-carbon ${look.ratio}`}>
                <div className="lookbook-inner absolute -inset-y-8 inset-x-0">
                  <img
                    src={look.src}
                    alt={look.label}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>
              <figcaption className="mt-3 flex items-center justify-between">
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">{look.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 md:mt-20 flex justify-center">
          <Link
            to="/women"
            className="group flex items-center gap-3 text-white text-[10px] tracking-button uppercase border-b border-white/20 hover:border-white pb-2 transition-colors duration-300"
          >
            See the full lookbook
            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LookbookSection;
