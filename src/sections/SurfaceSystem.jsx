import { useState } from 'react';
import { Arrow, OrbitalBackground, TechnicalFrame } from '../components/Graphics';
import MiniDemo from '../components/MiniDemo';
import SystemDiagram from '../components/SystemDiagram';

export default function SurfaceSystem() {
  const [xray, setXray] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState('experience');
  const [activeModule, setActiveModule] = useState('menu');
  const [lastEvent, setLastEvent] = useState('Pronto. Apri il menu o cambia la vista.');

  function toggleMenu() {
    const next = !menuOpen;
    setMenuOpen(next);
    setActiveModule('menu');
    setLastEvent(`onClick → setMenuOpen(${next}) → Menu ${next ? 'aperto' : 'chiuso'}`);
  }

  function changeView(next) {
    setView(next);
    setMenuOpen(false);
    setActiveModule('view');
    setLastEvent(`onClick → setView('${next}') → Hero aggiornato`);
  }

  return (
    <section
      id="process"
      data-main-section
      tabIndex="-1"
      className={`process framed-section ${xray ? 'xray-on' : ''}`}
      aria-labelledby="process-title"
    >
      <OrbitalBackground variant="process-orbital" />
      <TechnicalFrame />
      <div className="process-heading">
        <div>
          <p className="eyebrow">INDEX / 02 — 04</p>
          <h2 id="process-title" className="section-title process-title">
            <span>UNDER</span>
            <span>
              THE <em>INTERFACE.</em>
            </span>
          </h2>
        </div>
        <div className="process-intro">
          <h3>
            DESIGN & DEVELOPMENT
            <br />A CONNECTED PROCESS
          </h3>
          <p>
            Dall’esperienza visiva alle logiche
            <br />
            che la rendono possibile.
          </p>
        </div>
      </div>
      <div className="process-panels">
        <article className="surface-panel process-panel">
          <div className="panel-index">
            <span>01 / SURFACE</span>
            <Arrow diagonal />
          </div>
          <h3>
            DESIGN.
            <br />
            <em>EXPERIENCE.</em>
          </h3>
          <p className="panel-description">
            Interfacce, interazioni e percezione utente.
          </p>
          <div className="surface-content">
            <ul className="surface-labels" aria-label="Ambiti dell’interfaccia">
              <li className={activeModule === 'menu' ? 'selected' : ''}>UI / UX</li>
              <li className={activeModule === 'view' ? 'selected' : ''}>INTERACTION</li>
              <li>RESPONSIVE</li>
              <li>ANIMATION</li>
            </ul>
            <MiniDemo
              menuOpen={menuOpen}
              view={view}
              xray={xray}
              activeModule={activeModule}
              onMenu={toggleMenu}
              onView={changeView}
            />
          </div>
          <p className="demo-hint">
            DEMO INTERATTIVA <span>↗ Prova menu e pulsante</span>
          </p>
        </article>
        <div className="xray-control-wrap">
          <span className="xray-ring ring-a" aria-hidden="true" />
          <span className="xray-ring ring-b" aria-hidden="true" />
          <button
            className="xray-control"
            onClick={() => setXray(!xray)}
            aria-pressed={xray}
            aria-label="X-RAY MODE"
          >
            <span>
              X-RAY
              <br />
              MODE
            </span>
            <small>{xray ? 'ON' : 'OFF'}</small>
          </button>
        </div>
        <article className="system-panel process-panel">
          <div className="panel-index">
            <span>02 / SYSTEM</span>
            <span className="code-symbol" aria-hidden="true">
              &lt;/&gt;
            </span>
          </div>
          <h3>
            DEVELOPMENT.
            <br />
            <em>FUNCTIONALITY.</em>
          </h3>
          <p className="panel-description">
            Logica, integrazioni e architettura tecnica.
          </p>
          <SystemDiagram
            menuOpen={menuOpen}
            view={view}
            xray={xray}
            activeModule={activeModule}
            lastEvent={lastEvent}
          />
        </article>
        <div className="xray-bridge" aria-hidden="true" />
      </div>
      <div className="process-bottom">
        <span>EXPLORE THE PROCESS</span>
        <button
          className="mode-switch"
          aria-label="Attiva o disattiva la vista X-RAY"
          aria-pressed={xray}
          onClick={() => setXray(!xray)}
        >
          <span>
            ▣ <span>SURFACE</span>
          </span>
          <i>
            <b />
          </i>
          <span>
            <em>&lt;/&gt;</em> <span>SYSTEM</span>
          </span>
        </button>
        <span>01 — 02 / SURFACE × SYSTEM</span>
      </div>
    </section>
  );
}
