import { useRef } from 'react';
import { Arrow, Brand } from './Graphics';

export default function MiniDemo({
  menuOpen,
  view,
  xray,
  activeModule,
  onMenu,
  onView,
}) {
  const menuButton = useRef(null);

  function chooseView(next) {
    onView(next);
    menuButton.current?.focus();
  }

  return (
    <div className={`mini-device ${xray ? 'is-inspecting' : ''}`}>
      <div
        className={`mini-header inspectable ${activeModule === 'menu' ? 'is-selected' : ''}`}
        data-component="Menu"
      >
        <Brand small />
        <button
          ref={menuButton}
          className="mini-menu-button"
          aria-label={menuOpen ? 'Chiudi menu della demo' : 'Apri menu della demo'}
          aria-expanded={menuOpen}
          aria-controls="demo-menu"
          onClick={onMenu}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <nav className="mini-menu" id="demo-menu" aria-label="Navigazione della demo">
          <button onClick={() => chooseView('experience')}>
            01 / EXPERIENCE <span>↗</span>
          </button>
          <button onClick={() => chooseView('detail')}>
            02 / THE DETAILS <span>↗</span>
          </button>
        </nav>
      )}
      <div
        className={`mini-content inspectable ${activeModule === 'view' ? 'is-selected' : ''}`}
        data-component="Hero"
        aria-live="polite"
      >
        <div className="mini-planet" aria-hidden="true" />
        <p className="mini-kicker">
          {view === 'experience'
            ? 'INDEPENDENT WEB DEVELOPMENT'
            : 'MADE TO WORK. BUILT TO LAST.'}
        </p>
        <h4>
          {view === 'experience' ? 'DIGITAL' : 'EVERY'}
          <br />
          <em>{view === 'experience' ? 'EXPERIENCES.' : 'DETAIL COUNTS.'}</em>
        </h4>
        <button
          className="mini-cta"
          onClick={() => onView(view === 'experience' ? 'detail' : 'experience')}
        >
          {view === 'experience' ? 'ESPLORA LA DEMO' : 'TORNA ALLA VISTA'}
          <Arrow diagonal />
        </button>
        <span className="mini-pi">PI®</span>
      </div>
      {xray && <span className="inspection-caption">LIVE COMPONENT TREE / REACT</span>}
    </div>
  );
}
