import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function usePortfolioMotion(root) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from(
            '.hero .technical-frame i',
            { scale: 0.5, opacity: 0, duration: 0.7 },
            0,
          )
          .from(
            '.hero-word',
            { yPercent: 110, rotate: 2, duration: 1.1, stagger: 0.13 },
            0.12,
          )
          .from(
            '.hero-reveal',
            { y: 18, opacity: 0, duration: 0.75, stagger: 0.08 },
            0.6,
          )
          .from(
            '.portrait-image',
            { clipPath: 'inset(0 100% 0 0)', duration: 0.8 },
            0.8,
          )
          .fromTo(
            '.portrait-scan',
            { xPercent: -100 },
            { xPercent: 800, duration: 1.1 },
            0.9,
          );

        gsap.utils.toArray('.project-card').forEach((card) => {
          gsap.from(card.querySelector('.project-preview'), {
            clipPath: 'inset(12% 0 12% 0)',
            y: 28,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%', once: true },
          });
          gsap.from(card.querySelector('.project-caption'), {
            y: 14,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          });
        });

        gsap.from('.contact-word', {
          yPercent: 105,
          rotate: 2,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact', start: 'top 65%', once: true },
        });
        gsap.from('.contact-action', {
          scaleX: 0.8,
          opacity: 0,
          transformOrigin: 'left',
          duration: 0.8,
          scrollTrigger: { trigger: '.contact-action', start: 'top 96%', once: true },
        });
      },
      root,
    );

    media.add(
      '(min-width: 1000px) and (prefers-reduced-motion: no-preference)',
      () => {
        // Scroll transforms use parent elements, separate from the opening reveal.
        const structural = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom 15%',
            scrub: 0.65,
          },
        });
        structural
          .to('.hero-title', { y: -95, x: -35, ease: 'none' }, 0)
          .to('.interface-mask', { xPercent: -8, ease: 'none' }, 0)
          .to(
            '.hero-orbital .orbital-drift',
            { y: 180, rotate: -12, scale: 1.12, ease: 'none' },
            0,
          )
          .to('.hero .technical-frame', { scaleX: 1.05, scaleY: 1.12, ease: 'none' }, 0)
          .from('.surface-panel', { x: 75, y: 50, rotate: 2, ease: 'none' }, 0.35)
          .from('.system-panel', { x: -75, y: 50, rotate: -2, ease: 'none' }, 0.35);

        gsap.from('.xray-control-wrap', {
          scale: 0.7,
          opacity: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '.process-panels', start: 'top 65%', once: true },
        });

        const recomposition = gsap.timeline({
          scrollTrigger: {
            trigger: '.process',
            start: 'bottom 80%',
            end: 'bottom 15%',
            scrub: 0.5,
          },
        });
        recomposition
          .to('.process-panels', { scale: 0.95, y: 30, ease: 'none' }, 0)
          .to('.xray-bridge', { opacity: 0, ease: 'none' }, 0)
          .from('.work-heading', { y: 40, ease: 'none' }, 0)
          .from('.work-section .project-grid', { y: 35, ease: 'none' }, 0);

        gsap.from('.contact-fill', {
          clipPath: 'inset(0 8% 0 8% round 80px)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top bottom',
            end: 'top 20%',
            scrub: 0.5,
          },
        });

        const hero = root.current.querySelector('.hero');
        const orbit = hero.querySelector('.orbital-scene');
        const moveX = gsap.quickTo(orbit, 'x', { duration: 1.2, ease: 'power2.out' });
        const moveY = gsap.quickTo(orbit, 'y', { duration: 1.2, ease: 'power2.out' });
        const onMove = (event) => {
          const bounds = hero.getBoundingClientRect();
          moveX((event.clientX / bounds.width - 0.5) * 14);
          moveY(((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
        };
        const onLeave = () => {
          moveX(0);
          moveY(0);
        };
        hero.addEventListener('pointermove', onMove);
        hero.addEventListener('pointerleave', onLeave);

        return () => {
          hero.removeEventListener('pointermove', onMove);
          hero.removeEventListener('pointerleave', onLeave);
        };
      },
      root,
    );

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    return () => media.revert();
  }, [root]);
}
