import React from 'react';
import HeroSection from '../components/HeroSection';
import MarqueeStrip from '../components/MarqueeStrip';
import EditorialSection from '../components/EditorialSection';
import CollectionsSection from '../components/CollectionsSection';
import LatestSection from '../components/LatestSection';
import CategoryRail from '../components/CategoryRail';
import LookbookSection from '../components/LookbookSection';
import ValuesSection from '../components/ValuesSection';

/**
 * Section grounds alternate white → #ededed → #080808 deliberately; that
 * rhythm is the page's entire sense of pacing, so the order matters as much
 * as the sections themselves.
 */
const HomePage = () => (
  <>
    <HeroSection />
    <MarqueeStrip />
    <EditorialSection />
    <CollectionsSection />
    <LatestSection />

    <CategoryRail
      category="Men"
      eyebrow="Collection I"
      title="Men's Essentials"
      to="/men"
      ground="grey"
    />
    <CategoryRail
      category="Women"
      eyebrow="Collection II"
      title="Women's Studio"
      to="/women"
      ground="white"
    />

    <LookbookSection />

    <CategoryRail
      category="Accessories"
      eyebrow="Collection III"
      title="The Finishing Note"
      to="/accessories"
      ground="white"
    />

    <ValuesSection />
  </>
);

export default HomePage;
