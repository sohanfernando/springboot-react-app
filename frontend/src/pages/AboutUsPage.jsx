import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { gsap, SplitText, EASE, reveal, drawLine, parallax, prefersReducedMotion } from '../lib/motion';
import { Container, Eyebrow, ButtonLink } from '../components/ui/Primitives';

import plateHero from '../assets/T-shirts/Men/770198ca22bbf9adec7722c52e89e1d3b9896138_2000x.jpg';
import plate1 from '../assets/Shirts/6.webp';
import plate2 from '../assets/Dresses/2.webp';
import plate3 from '../assets/Accessories/IMG_1134-2_2000x.webp';

/* Chapters are a real sequence — the numbering carries order, not decoration. */
const CHAPTERS = [
  {
    step: '01',
    title: 'The Vision',
    body: 'FashionHub began with one conviction — that good clothing should be felt before it is seen. Every collection starts with an argument about fabric, and only later becomes a pattern.',
    img: plate1,
  },
  {
    step: '02',
    title: 'The Making',
    body: 'We work in short runs with a small number of makers in and around Colombo. Nothing goes to production until we have worn the sample for a season and found what is wrong with it.',
    img: plate2,
  },
  {
    step: '03',
    title: 'The Wearing',
    body: 'A piece earns its place by how often you reach for it. We would rather sell you four things you wear constantly than fourteen that rotate through a wardrobe once.',
    img: plate3,
  },
];

const FIGURES = [
  ['2025', 'Founded in Colombo'],
  ['48', 'Pieces in the current catalogue'],
  ['3–5', 'Days to your door, island-wide'],
  ['30', 'Days to change your mind'],
];

const SOCIALS = [
  { icon: FaInstagram, name: 'Instagram', handle: '@fashionhub', href: 'https://instagram.com' },
  { icon: FaFacebookF, name: 'Facebook', handle: '/fashionhub', href: 'https://facebook.com' },
];

const AboutUsPage = () => {
  const rootRef = useRef(null);
  const headlineRef = useRef(null);
  const heroPlateRef = useRef(null);

  useLayoutEffect(() => {
    let split;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        split = new SplitText(headlineRef.current, { type: 'chars' });
        gsap.set(headlineRef.current, { opacity: 1 });
        gsap.fromTo(
          split.chars,
          { y: '110%', opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: EASE.chars, stagger: 0.02, delay: 0.25 }
        );
        parallax(heroPlateRef.current, { yPercent: 12, scrub: 1.5 });
      } else {
        gsap.set(headlineRef.current, { opacity: 1 });
      }

      reveal('.about-item', { stagger: 0.09, y: 40, start: 'top 88%', trigger: rootRef.current });
      reveal('.chapter', { stagger: 0.1, y: 60, start: 'top 80%' });
      reveal('.figure-item', { stagger: 0.1, y: 40, start: 'top 85%' });
      drawLine('.about-rule', { start: 'top 90%' });
      parallax('.chapter-plate', { yPercent: -8, scrub: 1.5 });
    }, rootRef);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* Masthead */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24">
        <Container>
          <div className="mb-6">
            <Eyebrow>Our Story</Eyebrow>
          </div>
          <h1 className="font-playfair text-[clamp(2.5rem,8vw,6rem)] font-light leading-[0.98] max-w-4xl">
            <span className="split-line">
              <span ref={headlineRef} className="block">
                Clothes worth keeping.
              </span>
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 md:mt-16">
            <p className="about-item lg:col-span-5 lg:col-start-7 text-sm leading-relaxed text-black/55">
              A streetwear and lifestyle house working out of Colombo. We make a small catalogue
              carefully rather than a large one quickly, and we would rather a piece sell out than
              end up discounted into a landfill.
            </p>
          </div>
        </Container>
      </section>

      {/* Full-bleed plate */}
      <section className="overflow-hidden">
        <div className="relative h-[55vh] md:h-[75vh] overflow-hidden bg-void">
          <div ref={heroPlateRef} className="absolute -inset-y-12 inset-x-0">
            <img src={plateHero} alt="" aria-hidden="true" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/25" />
          <p className="absolute bottom-6 left-4 sm:left-6 md:left-12 text-white/50 text-[9px] tracking-[0.3em] uppercase">
            The studio — Colombo
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section className="py-24 md:py-36 bg-white overflow-hidden">
        <Container>
          <div className="about-rule h-px w-full bg-line origin-left mb-16 md:mb-24" />

          <div className="flex flex-col gap-24 md:gap-36">
            {CHAPTERS.map((chapter, i) => (
              <article
                key={chapter.step}
                className={`chapter grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                  i % 2 === 1 ? 'lg:[direction:rtl]' : ''
                }`}
              >
                <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
                  <div className="relative overflow-hidden bg-muted aspect-[4/5]">
                    <div className="chapter-plate absolute -inset-y-8 inset-x-0">
                      <img
                        src={chapter.img}
                        alt={chapter.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:[direction:ltr] lg:col-start-2' : 'lg:col-start-8'}`}>
                  <span className="font-playfair text-secondary text-[clamp(3rem,7vw,6rem)] leading-none font-light select-none block mb-6">
                    {chapter.step}
                  </span>
                  <h2 className="font-playfair text-3xl md:text-4xl font-light mb-5">{chapter.title}</h2>
                  <p className="text-sm leading-relaxed text-black/55 max-w-md">{chapter.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Figures */}
      <section className="py-20 md:py-28 bg-void text-white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {FIGURES.map(([value, label]) => (
              <div key={label} className="figure-item">
                <p className="font-playfair text-4xl md:text-5xl font-light mb-3 tabular-nums">{value}</p>
                <p className="text-[10px] tracking-label uppercase text-white/40 max-w-[22ch]">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Close */}
      <section className="py-24 md:py-36 bg-secondary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div className="about-item mb-6">
                <Eyebrow>Come in</Eyebrow>
              </div>
              <h2 className="about-item font-playfair text-3xl md:text-5xl font-light leading-tight max-w-2xl">
                Everything above is easier to judge with something on.
              </h2>
              <div className="about-item mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/latest">Shop Latest</ButtonLink>
                <ButtonLink to="/men" variant="outline">
                  Browse Everything
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="about-item">
                <Eyebrow>Elsewhere</Eyebrow>
                <div className="mt-6 flex flex-col gap-4">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between border-b border-black/10 pb-4 hover:border-black transition-colors duration-300"
                    >
                      <span className="flex items-center gap-3">
                        <social.icon size={15} className="text-black/40 group-hover:text-black transition-colors duration-300" />
                        <span className="text-[11px] tracking-label uppercase">{social.name}</span>
                      </span>
                      <span className="flex items-center gap-2 text-[11px] text-black/35">
                        {social.handle}
                        <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-8 text-[11px] leading-relaxed text-black/40">
                  <p>214 Modera Street</p>
                  <p>Colombo 01500, Sri Lanka</p>
                  <p className="mt-3">
                    <Link to="/aboutus" className="text-black pb-0.5 border-b border-black">
                      support@fashionhub.com
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutUsPage;
