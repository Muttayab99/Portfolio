import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores sensible scroll behaviour for a SPA with lazy-loaded sections:
 * - navigating to a new path scrolls to the top
 * - a hash (e.g. /#projects) scrolls to that element once it exists, which
 *   may be a few frames after the lazy chunk resolves
 */
export const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = hash.slice(1);
    let attempts = 0;
    let raf = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempts++ < 90) raf = requestAnimationFrame(tryScroll);
    };
    tryScroll();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
};
