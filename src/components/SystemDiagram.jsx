const modules = [
  { id: 'menu', icon: '≡', title: 'MENU', detail: 'useState' },
  { id: 'view', icon: '◇', title: 'VIEW', detail: 'render' },
  { id: 'events', icon: '↗', title: 'EVENTS', detail: 'onClick' },
  { id: 'deploy', icon: '⌁', title: 'DEPLOY', detail: 'static build' },
];

export default function SystemDiagram({
  menuOpen,
  view,
  xray,
  activeModule,
  lastEvent,
}) {
  const lines = [
    <>
      <span className="code-accent">const</span> state = {'{'}
    </>,
    <>
      {' '}
      menuOpen: <span className="code-value">{String(menuOpen)}</span>,
    </>,
    <>
      {' '}
      view: <span className="code-value">'{view}'</span>,
    </>,
    <>{'};'}</>,
    <> &lt;Layout&gt;</>,
    <> &lt;Menu /&gt;</>,
    <> &lt;Hero /&gt;</>,
    <> &lt;/Layout&gt;</>,
    <>;</>,
  ];

  return (
    <div className={`system-diagram ${xray ? 'is-active' : ''}`}>
      <div className="code-window" aria-label="Stato attuale della mini-demo">
        <div className="code-window-label">
          <span />
          {xray ? 'LIVE STATE' : 'COMPONENT MAP'}
        </div>
        <pre>
          <code>
            {lines.map((line, index) => (
              <span
                className={`code-line ${xray && ((activeModule === 'menu' && index === 1) || (activeModule === 'view' && index === 2)) ? 'code-highlight' : ''}`}
                key={index}
              >
                <span className="line-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {line}
              </span>
            ))}
          </code>
        </pre>
      </div>
      <div className="system-links" aria-hidden="true">
        <span />
      </div>
      <ul className="system-modules">
        {modules.map((module) => (
          <li
            key={module.id}
            className={
              xray && (module.id === activeModule || module.id === 'events')
                ? 'module-active'
                : ''
            }
          >
            <span className="module-icon" aria-hidden="true">
              {module.icon}
            </span>
            <div>
              {module.title}
              <small>{module.detail}</small>
            </div>
          </li>
        ))}
      </ul>
      <div className="event-readout" aria-live="polite" aria-atomic="true">
        <span>{xray ? '● LIVE' : '○ READY'}</span>
        {xray ? lastEvent : 'Attiva X-RAY e interagisci con la demo.'}
      </div>
    </div>
  );
}
