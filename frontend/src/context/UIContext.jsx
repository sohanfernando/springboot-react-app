/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within a UIProvider');
  return ctx;
};

const SESSION_KEY = 'fh_preloader';

/**
 * The preloader runs once per session. Everything that has to wait for the
 * curtain — the nav dropping in, the hero timeline — reads `introDelay`
 * instead of hard-coding a wall-clock delay, so a repeat visit starts
 * immediately rather than sitting blank for two seconds.
 */
export const UIProvider = ({ children }) => {
  const [preloaderSeen] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem(SESSION_KEY));
    } catch {
      return false;
    }
  });

  const [preloaderDone, setPreloaderDone] = useState(preloaderSeen);
  const [searchOpen, setSearchOpen] = useState(false);

  const markPreloaderDone = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode — the preloader simply runs again */
    }
    setPreloaderDone(true);
  }, []);

  const value = useMemo(
    () => ({
      preloaderSeen,
      preloaderDone,
      markPreloaderDone,
      // seconds the opening curtain occupies before content should move
      introDelay: preloaderSeen ? 0.15 : 2.3,
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
    }),
    [preloaderSeen, preloaderDone, markPreloaderDone, searchOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
