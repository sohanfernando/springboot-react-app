import React from 'react';

const ITEMS = [
  'Free shipping over Rs 5,000',
  'Small-batch production',
  'Colombo — since 2025',
  '30-day returns',
];

/**
 * A single hairline strip between the hero and the editorial. It exists to
 * break the two full-bleed blocks apart, so it stays thin and quiet.
 */
const MarqueeStrip = () => {
  const run = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="bg-void text-white overflow-hidden py-3.5 select-none">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1 ? 'true' : undefined}>
            {run.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex items-center text-[10px] tracking-eyebrow uppercase text-white/40 whitespace-nowrap"
              >
                {item}
                <span className="mx-8 sm:mx-12 w-1 h-1 bg-white/20 rounded-full" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
