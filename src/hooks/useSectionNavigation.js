import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function scrollToSection(id, focus = false, immediate = false) {
  const element = document.getElementById(id);
  if (!element) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduced || immediate ? 'instant' : 'smooth' });
  if (focus) element.focus({ preventScroll: true });
}

export default function useSectionNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState('home');

  useEffect(() => {
    if (location.pathname !== '/') return;

    const destination = location.state?.section;
    const frame = requestAnimationFrame(() => {
      if (destination) scrollToSection(destination, true, true);
    });

    const update = () => {
      const sections = [...document.querySelectorAll('[data-main-section]')];
      const threshold = window.innerHeight * 0.38;
      const current = sections.findLast(
        (section) => section.getBoundingClientRect().top <= threshold,
      );
      setActive(current?.id || 'home');
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, [location]);

  const goTo = useCallback(
    (id) => {
      if (location.pathname !== '/') {
        navigate('/', { state: { section: id } });
      } else {
        scrollToSection(id, true);
      }
    },
    [location.pathname, navigate],
  );

  return { active: location.pathname === '/archive' ? 'work' : active, goTo };
}
