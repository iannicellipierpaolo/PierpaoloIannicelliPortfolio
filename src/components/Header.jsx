import { useEffect, useRef, useState } from 'react';
import { Brand, Arrow } from './Graphics';
import { navigation } from '../config/site';
import useSectionNavigation from '../hooks/useSectionNavigation';

export default function Header() {
  const { active, goTo } = useSectionNavigation();
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector('button')?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...panel.current.querySelectorAll('button')];
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function visit(id) {
    setOpen(false);
    goTo(id);
  }

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Vai al contenuto
      </a>
      <header className="site-header">
        <button
          className="brand-link"
          aria-label="BUILT DIFFERENT — torna alla home"
          onClick={() => visit('home')}
        >
          <Brand />
        </button>
        <div className="header-role">
          PI® <span>/</span> WEB DEVELOPER
        </div>
        <nav className="desktop-nav" aria-label="Navigazione principale">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => visit(item.id)}
              aria-current={active === item.id ? 'location' : undefined}
            >
              <span>{item.number}</span> {item.label}
            </button>
          ))}
        </nav>
        <button
          ref={toggle}
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
          aria-controls="global-menu"
        >
          <span />
          <span />
        </button>
      </header>
      {open && (
        <div
          className="menu-backdrop"
          onClick={() => {
            setOpen(false);
            toggle.current?.focus();
          }}
        >
          <nav
            id="global-menu"
            ref={panel}
            className="menu-panel"
            aria-label="Menu completo"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">INDEX / 01 — 04</p>
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => visit(item.id)}
                aria-current={active === item.id ? 'location' : undefined}
              >
                <span>{item.number}</span>
                {item.label}
                <Arrow diagonal />
              </button>
            ))}
            <p className="menu-signature">PI® / BEYOND THE INTERFACE.</p>
          </nav>
        </div>
      )}
    </>
  );
}
