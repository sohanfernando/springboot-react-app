import React, { useLayoutEffect, useRef } from 'react';
import { Gem, Recycle, Truck, RotateCcw } from 'lucide-react';
import { gsap, reveal, drawLine } from '../lib/motion';
import { SectionHeader } from './ui/Primitives';

const VALUES = [
  {
    icon: Gem,
    title: 'Material First',
    body: 'Fabric is chosen before the pattern. If the cloth is wrong, the piece never gets made.',
  },
  {
    icon: Recycle,
    title: 'Small Runs',
    body: 'Limited quantities per style. We would rather sell out than discount into a landfill.',
  },
  {
    icon: Truck,
    title: 'Island-wide Delivery',
    body: 'Free above Rs 5,000, tracked from our Colombo studio to your door in 3–5 days.',
  },
  {
    icon: RotateCcw,
    title: 'Thirty Days',
    body: 'Wear it, live in it, decide. Unworn returns accepted for a full month, no questions.',
  },
];

const ValuesSection = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The rule draws first, then the items arrive underneath it.
      drawLine('.values-line', { start: 'top 78%', duration: 1.5, trigger: rootRef.current });
      reveal('.value-item', { stagger: 0.12, y: 40, duration: 0.8, start: 'top 72%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="py-24 md:py-36 bg-secondary">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader eyebrow="Why us" title="How we work" />

        <div className="values-line h-px w-full bg-black/10 origin-left mb-12 md:mb-16" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {VALUES.map((value, i) => (
            <div key={value.title} className="value-item group">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-playfair text-black/15 text-2xl leading-none tabular-nums select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <value.icon
                  size={18}
                  strokeWidth={1.4}
                  className="text-black/40 group-hover:text-black transition-colors duration-300"
                />
              </div>
              <h3 className="text-sm font-medium tracking-[0.06em] mb-3">{value.title}</h3>
              <p className="text-[13px] leading-relaxed text-black/50 max-w-[38ch]">{value.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
