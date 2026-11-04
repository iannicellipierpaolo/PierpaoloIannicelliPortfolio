import { useState } from 'react';
import { Arrow } from './Graphics';
import { assetUrl, safeProjectUrl } from '../data/project-utils';

export default function ProjectCard({ project, index, compact = false }) {
  const [failed, setFailed] = useState(false);
  const url = safeProjectUrl(project.url);
  const number = String(index + 1).padStart(3, '0');
  const labels = {
    placeholder: 'SEGNAPOSTO',
    demo: 'DEMO / CONCEPT',
    real: 'PROGETTO',
  };
  const preview = (
    <>
      {project.screenshot && !failed ? (
        <img
          src={assetUrl(project.screenshot)}
          alt={`Anteprima del sito ${project.name}`}
          loading="lazy"
          width="1200"
          height="750"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`project-placeholder placeholder-${index % 4}`}>
          <div className="placeholder-top">
            <span>PI® / SELECTED WORK</span>
            <span>[ {number} ]</span>
          </div>
          <div className="placeholder-center">
            <span className="placeholder-number">{number}</span>
            <span className="placeholder-cross" aria-hidden="true">
              +
            </span>
          </div>
          <div className="placeholder-bottom">
            <span>ANTEPRIMA DA INSERIRE</span>
            <span>↗</span>
          </div>
        </div>
      )}
      <span className="project-badge">
        {labels[project.status] || 'DEMO / CONCEPT'}
      </span>
      {url && (
        <span className="preview-visit">
          <Arrow diagonal />
        </span>
      )}
    </>
  );

  return (
    <article className={`project-card ${compact ? 'compact' : ''}`}>
      {url ? (
        <a
          className="project-preview"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visita ${project.name}, nuova scheda`}
        >
          {preview}
        </a>
      ) : (
        <div className="project-preview unconfigured">{preview}</div>
      )}
      <div className="project-caption">
        <div className="project-name">
          <span>{number}</span>
          <h3>{project.name}</h3>
        </div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            VISIT LIVE SITE <Arrow diagonal />
          </a>
        ) : (
          <span className="project-pending">
            LINK DA CONFIGURARE <span>↗</span>
          </span>
        )}
      </div>
      <p className="project-category">{project.category}</p>
    </article>
  );
}
