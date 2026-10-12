import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap, EASE, showNow, whenInView, prefersReducedMotion } from '../lib/motion';
import { SectionHeader } from './ui/Primitives';
import menImage from '../assets/T-shirts/Men/9ce2366ce272373334076db0a4f1404c85a17bb0_2000x.jpg';
import womenImage from '../assets/Dresses/1.webp';
import accessoriesImage from '../assets/Accessories/IMG_1134-2_2000x.webp';

const COLLECTIONS = [
  {
    id: 'men',
    accent: 'Collection I',
    label: 'Men',
    headline: 'Masculine Refinement',
    desc: 'Precision tailoring and elevated essentials, cut clean.',
    img: menImage,
    to: '/men',
  },
  {
    id: 'women',
    accent: 'Collection II',
    label: 'Women',
    headline: 'Feminine Precision',
    desc: 'Fluid silhouettes in fabrics that hold their shape.',
    img: womenImage,
    to: '/women',
  },
  {
    id: 'accessories',
    accent: 'Collection III',
    label: 'Accessories',
    headline: 'The Finishing Note',
    desc: 'The pieces that decide whether an outfit lands.',
    img: accessoriesImage,
    to: '/accessories',
  },
];

const CollectionsSection = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      showNow(rootRef.current?.querySelectorAll('.collection-item'));
      return undefined;
    }

    const stops = [];

    const ctx = gsap.context(() => {
      // Each card watches itself, with an index delay — not one shared
      // trigger on the section.
      gsap.utils.toArray('.collection-item').forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 60 });
        stops.push(
          whenInView(el, () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: EASE.enter,
              delay: i * 0.15,
              overwrite: 'auto',
            });
          })
        );
      });
    }, rootRef);

    return () => {
      stops.forEach((stop) => stop());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="py-24 md:py-36 bg-void">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader eyebrow="Browse" title="The Collections" onDark />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.id}
              to={c.to}
              className="collection-item group relative block"
            >
              <div className="relative overflow-hidden bg-carbon aspect-[3/4]">
                <img
                  src={c.img}
                  alt={c.headline}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-700 group-hover:from-black/90" />

                <span className="absolute top-5 left-5 text-[9px] tracking-[0.3em] uppercase text-white/40">
                  {c.accent}
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                  <p className="text-[10px] tracking-eyebrow uppercase text-white/40 mb-3">{c.label}</p>
                  <h3 className="font-playfair text-white text-2xl md:text-[1.75rem] font-light leading-tight mb-3">
                    {c.headline}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/45 mb-6 max-w-[34ch]">{c.desc}</p>

                  <span className="flex items-center gap-2 text-white text-[10px] tracking-[0.3em] uppercase">
                    Shop {c.label}
                    <ArrowRight
                      size={12}
                      strokeWidth={1.5}
                      className="translate-x-0 group-hover:translate-x-2 transition-transform duration-300"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
